import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const errorResponse: any = {
            status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            errorName: exception?.name,
            message: exception?.message,
        };

        this.logger.log(`Request method: ${request.method} request url${request.url}`, JSON.stringify(errorResponse));
        response.status(status).json(errorResponse);
    }
}
