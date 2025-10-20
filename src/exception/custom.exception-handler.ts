import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { CustomException } from './custom.exception';
import { Response } from 'express';

@Injectable()
@Catch(CustomException)
export class ExceptionHandler implements ExceptionFilter {
  constructor() {}

  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      path: request.url,
      statusCode: status,
      errorCode: exception.message,
    });
  }
}
