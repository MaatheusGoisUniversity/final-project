import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class BodyMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: Function) {
        req.app.locals.email = req.session.email
        req.app.locals.fullBody = true
        return next()
    }
}