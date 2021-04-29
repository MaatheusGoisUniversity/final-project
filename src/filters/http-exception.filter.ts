import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let message =
            exception instanceof HttpException
                ? exception.message
                : exception;
        if (message == 'Unauthorized') message = 'Você precisa estar logado para realizar essa operação, tente realizar o login!'
        response.json({
            success: false,
            message: message
        });
    }
}