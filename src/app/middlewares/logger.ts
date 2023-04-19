import { NextFunction, Request, Response } from "express";
import { createNewLogger } from "../utils/logger";

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
  const serverLogger = createNewLogger("server");
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
