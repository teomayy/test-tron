export type LogLevel = 'info' | 'warn' | 'error';

export interface ILoggerService {
  log(message: string, level?: LogLevel): Promise<void>;
}
