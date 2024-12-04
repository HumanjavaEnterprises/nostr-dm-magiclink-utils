import winston from 'winston';

const { createLogger: winstonCreateLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

export function createLogger(serviceName: string) {
    return winstonCreateLogger({
        format: combine(
            label({ label: serviceName }),
            timestamp(),
            myFormat
        ),
        transports: [
            new transports.Console({
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
            })
        ]
    });
}
