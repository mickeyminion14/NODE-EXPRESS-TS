import express, {Request, Response} from 'express';
import {apiRouter} from './api/api.routes';
import * as swagger from 'swagger-express-ts';
import {createNewLogger} from './utils/logger';
import {Server} from 'http';
import {loggerMiddleWare} from './middlewares/logger';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import {mongoDAO} from './database/mongo/mongo.db';
import {apiMiddleware} from './middlewares/api';
import {ResponseError} from './utils/error.util';
const config = require('config');
const serverLogger = createNewLogger('server');

export class Application {
  instance = express();

  get port() {
    return this.instance.get('port');
  }

  constructor() {
    this.instance.set('port', config.port);
  }
  static init() {
    const app = new Application();
    const server = new Server(app.instance);

    server.on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr!.port;
      serverLogger.info('Listening on ' + bind);
    });

    server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      const bind: any = typeof app.port === 'string' ? 'Pipe ' + app.port : 'Port ' + app.port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          serverLogger.error(bind + ' requires elevated privileges');
          process.exit(1);
        // break;
        case 'EADDRINUSE':
          serverLogger.error(bind + ' is already in use');
          process.exit(1);
        // break;
        default:
          throw error;
      }
    });

    process.on('SIGTERM', () => {
      serverLogger.info('SIGTERM signal received.');
      serverLogger.info('Closing http server.');
      server.close(async () => {
        serverLogger.info('Http server closed.');
        // Close All Database Connections
        await Promise.all([mongoDAO.close()]);
        // close process
        process.exit(0);
      });
    });

    app
      .load()
      .then(() => {
        server.listen(app.port, () => {
          serverLogger.info(`Swagger URL "${config.url}/api-docs/swagger"`);
        });
      })
      .catch((error) => {
        serverLogger.info(Object.keys(error));
        serverLogger.error(error.message || 'App Loading failed');
        process.exit(1);
      });
  }

  async load() {
    this.initConfig();
    this.instance.use('/api/v1', apiRouter);

    await Promise.all([mongoDAO.connect()]);
    // render app if no route matched
    this.instance.use((err: ResponseError, req: Request, res: Response, next: express.NextFunction) => {
      res.status(err.status || 400).json({message: err.message});
      // res.error(new ResponseError(err.status, err.message));
    });
    this.instance.use((req: express.Request, res: express.Response) => {
      res.status(404).json({message: 'Not Found'});
    });
  }

  initConfig() {
    //Api Middleware
    if (process.env.NODE_ENV === 'development') {
      this.instance.use(cors());
    }
    this.instance.use(apiMiddleware);
    //Initialize swagger
    this.initSwagger();
    //Logger Middleware
    this.instance.use(loggerMiddleWare);
    //Set well-known security-related HTTP headers
    this.instance.use(helmet());
    this.instance.use(compression());
    this.instance.disable('x-powered-by');
    this.instance.use(express.json({limit: '50mb'}));
    this.instance.use(express.urlencoded({extended: true, limit: '50mb'}));
  }

  initSwagger() {
    /** Swagger Implementation Start  */

    this.instance.use('/api-docs/swagger', express.static('swagger'));
    this.instance.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    this.instance.use(
      swagger.express({
        definition: {
          info: {
            title: 'My api',
            version: '1.0'
          },
          basePath: '/api/v1',
          schemes: ['http']
        }
      })
    );
    /** Swagger Implementation Ends  */
  }
}
