import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const logDir = __dirname + '/../../../logs';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `${level}.%DATE%.log`,
    maxFiles: 30,
    zippedArchive: true,
    colorize: false,
    handleExceptions: true,
    json: false,
    format: winston.format.combine(
      winston.format(info => {
        if (info.level !== level) {
          return false;
        }

        return info;
      })(),
      winston.format.timestamp(),
      winston.format.printf(info => {
        return `[aja-aja-api] ${process.pid} - ${info.timestamp} - ${info.level}  : ${info.message} `;
      }),
    ),
  };
};

// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const WinstonConfig = () => ({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'prod' ? 'http' : 'silly',
      format:
        process.env.NODE_ENV === 'prod'
          ? winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf(info => {
                return `[aja-aja-api] ${process.pid} - ${info.timestamp} - ${info.level}  : ${info.message} `;
              }),
            )
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              winston.format.printf(info => {
                return `\x1b[32m[aja-aja-api]\x1b[32m \x1b[32m${process.pid}\x1b[32m - \x1b[33m${info.timestamp}\x1b[33m - ${info.level}  : ${info.message} `;
              }),
            ),
    }),
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
