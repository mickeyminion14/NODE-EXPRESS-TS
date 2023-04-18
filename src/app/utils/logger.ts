import { Request, Response, NextFunction } from "express";
import colorizeJson from "json-colorizer";
import { createLogger, transports, Logger, config, format } from "winston";

const createNewLogger = (mod: string, filename?: string): Logger => {
  return createLogger({
    levels: config.syslog.levels,
    defaultMeta: { module: mod },
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp({
            format: "YY-MM-DD HH:MM:SS",
          }),
          format.colorize({
            all: true,
          }),
          format.printf((info) => {
            const data = info.data
              ? "\n" + colorizeJson(JSON.stringify(info.data, null, 2))
              : "";
            return `${info.timestamp} [${mod.toUpperCase()}] ${
              info.message
            }${data}`;
          })
        ),
      }),
      new transports.File({
        filename: filename || "combined.log",
        dirname: "logs",
      }),
    ],
  });
};

export const loggerMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.startTime = Date.now();
  if (req.path === "/") {
    return next();
  }
  const startTime = Date.now();
  res.on("finish", () => {
    const time = Date.now() - startTime;
    const color =
      res.statusCode >= 500
        ? 31 // red
        : res.statusCode >= 400
        ? 33 // yellow
        : res.statusCode >= 300
        ? 36 // cyan
        : res.statusCode >= 200
        ? 32 // green
        : 0; // no color
    serverLogger.info(
      `${req.method} ${req.baseUrl + req.path} \x1b[${color}m${
        res.statusCode
      }\x1b[0m - ${time} ms`,
      {
        data: {
          params: req.params || {},
          query: req.query || {},
          body: req.body || {},
          headers: req.headers,
        },
      }
    );
  });
  next();
};
export const serverLogger = createNewLogger("server");
