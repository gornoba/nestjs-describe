import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import requestIp from 'request-ip';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Error) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      response.status(500).json({
        success: false,
        timestamp: this.koreaTime(),
        statusCode: 500,
        path: request.url,
        message: exception?.message || null,
        ip: this.requestIp(request),
      });
    } else {
      if (exception !== null && typeof exception === 'object') {
        this.logger.error(
          `Error type is constructor name: ${(exception as any).constructor.name}`,
        );
      } else {
        this.logger.error(`Error type is ${typeof exception}`);
      }

      super.catch(exception, host);
    }
  }

  private koreaTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private requestIp(request: Request) {
    return request.header['cf-connecting-ip']
      ? request.header['cf-connecting-ip']
      : requestIp.getClientIp(request);
  }
}
