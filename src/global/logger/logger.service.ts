import { LoggerServiceDto } from './logger.service.dto';

export interface LoggerService {
  info(serviceDto: LoggerServiceDto): void;
  error(serviceDto: LoggerServiceDto): void;
}

export const LoggerServiceToken: unique symbol = Symbol('LoggerService');
