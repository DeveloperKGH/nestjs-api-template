import { LoggerServiceDto } from './logger.service.dto';

export interface LoggerService {
  info(serviceDto: LoggerServiceDto): Promise<void>;
  error(serviceDto: LoggerServiceDto): Promise<void>;
}

export const LoggerServiceToken: unique symbol = Symbol('LoggerService');
