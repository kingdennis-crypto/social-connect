import winston, {
  transports,
  format,
  config,
  createLogger,
  Logform,
} from 'winston'
import type { Logger } from 'winston'

/**
 * A singleton service for managing the logging functionalities
 */
export default class LoggerService {
  // The singleton instance
  private static instance: LoggerService
  // The logger instance
  private logger: Logger
  // Log levels with color mapping
  logLevels: config.AbstractConfigSetColors

  private constructor() {
    this.logLevels = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      verbose: 'cyan',
      debug: 'blue',
    }

    this.logger = this.createLogger()
  }

  /**
   * Creates and configures a Winston logger instance
   * @returns {Logger} The configured logger instance
   * @private
   */
  private createLogger(): Logger {
    // Configure the logger
    const logger: Logger = createLogger({
      levels: config.npm.levels,
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.splat(),
        format.printf(
          ({ timestamp, level, message }: Logform.TransformableInfo) => {
            return `[${timestamp} ${level}: ${message}]`
          }
        )
      ),
      transports: [
        // TODO: Make sure that error doesn't go into access.log
        new transports.File({
          format: format.combine(format.uncolorize(), format.simple()),
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({
          format: format.combine(format.uncolorize(), format.simple()),
          filename: 'logs/access.log',
          level: 'info',
        }),
      ],
    })

    // Add console logging in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      )
    }

    // Add custom colors for the log levels
    winston.addColors(this.logLevels)

    return logger
  }

  /**
   * Retrieves and returns the singleton instance of the LoggerService class.
   * If no instance exists, create a new one and return it.
   * @static
   * @returns {LoggerService} The singleton instance
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService()
    }

    return LoggerService.instance
  }

  /**
   * Retrieves the configured logger instance
   * @returns {Logger} The logger instance
   */
  public getLogger(): Logger {
    return this.logger
  }
}
