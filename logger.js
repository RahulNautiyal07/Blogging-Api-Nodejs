const { createLogger, transports, format } = require("winston");

const logger = createLogger({
    transports : [
        new transports.File({
            filename: "./logs/user.log",
            level: "info",
            format : format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: "./logs/user-error.log",
            level: "error",
            format : format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: "./logs/system-error.log",
            level: "system-level",
            format : format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename: "./logs/post-error.log",
            level: "postError",
            format : format.combine(format.timestamp(),format.json())
        })
    ]
})

module.exports =  logger 