import colorizeJson from "json-colorizer";
import { createLogger, transports, Logger, config, format } from "winston";

export const createNewLogger = (mod: string, filename?: string): Logger => {
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
