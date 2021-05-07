import { Controller, UseGuards, Post, Request, Get, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnswerDTO } from 'src/dto/server/answer.dto';
import { RecoverEmailDTO } from 'src/dto/users/recover-email.dto';
import { ResetPasswordDTO } from 'src/dto/users/reset-password.dto';
import { AuthService } from './auth.service';
import { UsersLoginDto } from './dto/users-login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginUserDto: UsersLoginDto) {
        try {
            const user = await this.authService.validateUser(loginUserDto);
            const message = "Login efetuado com sucesso!";
            const token = await this.authService.login(user);
            const name = user.name;
            const data = {
                token,
                name
            }

            return new AnswerDTO<any>(message, data);

        } catch (error) {
            console.log("data", error)
            throw error.message || error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('jwt')
    @ApiBearerAuth()
    getProfile(@Request() req: any) {
        return new AnswerDTO<string>('JWT lido com sucesso', req.user)
    }

    @Post('/recover-email')
    async sendRecoverPasswordEmail(@Body() recover: RecoverEmailDTO): Promise<AnswerDTO<number>> {
        await this.authService.sendRecoverPasswordEmail(recover.email);
        return new AnswerDTO('Foi enviado um email com instruções para resetar sua senha');
    }

    @Post('/reset-password')
    async resetPassword(@Body() reset: ResetPasswordDTO): Promise<AnswerDTO<number>> {
        await this.authService.resetPassword(reset);
        return new AnswerDTO('Senha alterada com sucesso!');
    }
}
