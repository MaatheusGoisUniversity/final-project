import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: Function) {
        if (req.session && req.session.email)
            return next();
        res.redirect('/')
    }
}