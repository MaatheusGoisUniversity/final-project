import { EmailsService } from './../helpers/emails/emails.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ReadUserDTO } from 'src/dto/users/read-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersLoginDto } from './dto/users-login.dto';
import { AuthEmailDTO } from 'src/dto/emails/auth-email.dto';
import { SendEmailDTO } from 'src/dto/emails/send-email.dto';
import { ResetPasswordDTO } from 'src/dto/users/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly emailService: EmailsService
    ) { }

    async validateUser(loginUserDto: UsersLoginDto): Promise<ReadUserDTO> {
        if (!loginUserDto.email || !loginUserDto.password) {
            throw "É requirido o envio do campo `email` e `senha`"
        }
        const user = await this.usersService.validateUser(loginUserDto);
        return user;
    }

    async login(user: ReadUserDTO) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    async loginUser(login: UsersLoginDto): Promise<ReadUserDTO> {
        return await this.usersService.validateUser(login);
    }

    async resetPassword(reset: ResetPasswordDTO) {
        await this.usersService.resetPassword(reset);

    }

    async sendRecoverPasswordEmail(email: string) {
        const user = await this.usersService.recovery(email);
        return await this.sendEmail(email, user.recoverToken)
    }

    private async sendEmail(email: string, text: string) {
        const auth = new AuthEmailDTO()
        auth.user = 'br.micro.service@gmail.com'
        auth.pass = 'micro123!@#'

        const emailToSend = new SendEmailDTO()
        emailToSend.from = 'noreply@service.com'
        emailToSend.to = [email]
        emailToSend.subject = 'Recuperação de senha'
        emailToSend.text = `Código de recuperação: ${text}`
        emailToSend.html = ''
        emailToSend.auth = auth
        await this.emailService.sendEmail(emailToSend);
    }
}
