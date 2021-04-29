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

    /**
     * Função que registra utilizando token JWT o login de um usuário
     * 
     * @param req dados do usuário autenticado no sistema
     * 
     * @returns retorna um objeto contendo a chave JWT
     */
    @Post('login')
    async login(@Body() loginUserDto: UsersLoginDto) {
        try {
            const user = await this.authService.validateUser(loginUserDto);
            const message = "Login efetuado com sucesso!";
            const data = await this.authService.login(user);

            return new AnswerDTO<string>(message, data);

        } catch (error) {
            console.log("data", error)
            throw error.message || error;
        }
    }

    /**
     * Método utilitário para ajudar no desenvolvimento, retorna
     * os dados de payload do token JWT, caso ele seja válido
     * 
     * @param req dados do usuário autenticado no atributo user
     * 
     * @returns o playload do token JWT
     */
    @UseGuards(JwtAuthGuard)
    @Get('jwt')
    @ApiBearerAuth()
    getProfile(@Request() req: any) {
        return req.user;
    }


    /**
     * Método utilitário para a recuperação de senha do usuário,
     * ele envia um e-mail para o usuário para a confirmação da senha.
     *
     * @param req dados do usuário autenticado no atributo user
     *
     * @returns o playload do token JWT
    */
    @Post('/recover-email')
    async sendRecoverPasswordEmail(@Body() recover: RecoverEmailDTO): Promise<AnswerDTO<number>> {
        await this.authService.sendRecoverPasswordEmail(recover.email);
        return new AnswerDTO('Foi enviado um email com instruções para resetar sua senha', 200);
    }

    /**
     * Método utilitário para a recuperação de senha do usuário,
     * ele envia um e-mail para o usuário para a confirmação da senha.
     *
     * @param req dados do usuário autenticado no atributo user
     *
     * @returns o playload do token JWT
    */
    @Post('/reset-password')
    async resetPassword(@Body() reset: ResetPasswordDTO): Promise<AnswerDTO<number>> {
        await this.authService.resetPassword(reset);
        return new AnswerDTO('Senha alterada com sucesso!', 200);
    }
}
