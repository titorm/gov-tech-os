import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
// fastify types intentionally omitted in minimal stub

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // Avoid importing Fastify types at build-time in this minimal stub
    const response: any = ctx.getResponse();
    const request: any = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      ...(typeof exceptionResponse === 'object' ? exceptionResponse : {}),
    };

    this.logger.warn(`HTTP Exception: ${request.method} ${request.url} - ${status} ${exception.message}`);

    response.status(status).send(errorResponse);
  }
}
