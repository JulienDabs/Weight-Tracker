import { Logger, HttpException, HttpStatus } from '@nestjs/common';

const logger = new Logger('ErrorHandler');

export function handleHttpError(error: any, methodName: string): void {
  logger.error(`Error in ${methodName}: ${error.message}`, error.stack);

  if (error.response) {
    const { status, data } = error.response;

    logger.error(`Response Error (Status: ${status}): ${JSON.stringify(data)}`);

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        throw new HttpException(
          data?.message || 'Bad Request',
          HttpStatus.BAD_REQUEST,
        );
      case HttpStatus.UNAUTHORIZED:
        throw new HttpException(
          data?.message || 'Unauthorized Access',
          HttpStatus.UNAUTHORIZED,
        );
      case HttpStatus.FORBIDDEN:
        throw new HttpException(
          data?.message || 'Forbidden Access',
          HttpStatus.FORBIDDEN,
        );
      case HttpStatus.NOT_FOUND:
        throw new HttpException(
          data?.message || 'Resource Not Found',
          HttpStatus.NOT_FOUND,
        );
      case HttpStatus.REQUEST_TIMEOUT:
        throw new HttpException(
          data?.message || 'Request Timeout',
          HttpStatus.REQUEST_TIMEOUT,
        );
      case HttpStatus.TOO_MANY_REQUESTS:
        throw new HttpException(
          data?.message || 'Too Many Requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        throw new HttpException(
          data?.message || 'Internal Server Error',
          status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  } else if (error.request) {
    logger.error('Request Error: No response received from service');
    throw new HttpException(
      'Service Unreachable. Please try again later.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  } else if (error.code === 'ECONNABORTED') {
    logger.error(`Timeout Error: ${error.message}`);
    throw new HttpException(
      'Request Timeout. Please try again later.',
      HttpStatus.REQUEST_TIMEOUT,
    );
  } else {
    logger.error(`Unknown Error: ${error.message}`);
    throw new HttpException(
      'An unexpected error occurred. Please contact support.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
