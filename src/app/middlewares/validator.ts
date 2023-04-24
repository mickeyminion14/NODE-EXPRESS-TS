import * as Joi from 'joi';
import {NextFunction, Request, Response} from 'express';
import {ResponseError} from '../utils/error.util';
import {serverLogger} from '../utils/logger';

type DataResolver = 'body' | 'params' | 'query' | ((req: Request) => any);
declare const createError: ErrorConstructor;

export function validateSchema(schema: Joi.ObjectSchema, dataResolver: DataResolver = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    // console.log('Validating Schema');
    const data = typeof dataResolver === 'function' ? dataResolver(req) : req[dataResolver!];
    try {
      const result = Joi.attempt(data, schema);
      req.data = {
        ...(req.data || {}),
        ...result
      };
      next();
    } catch (error: any) {
      const message: string = error.details[0].message.split("'").join('');
      res.error(new ResponseError(244, message.replace(new RegExp('"', 'gi'), '')));
    }
  };
}
