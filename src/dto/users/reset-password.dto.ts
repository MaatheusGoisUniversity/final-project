import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordDTO {
    @IsEmail({}, { message: 'Esse e-mail não é válido.' })
    @ApiProperty()
    email: string;

    @IsNotEmpty({
        message: "A senha não pode ser vazia."
    })
    @MinLength(8, {
        message: "A senha deve conter no mínimo de 8 caracteres."
    })
    @ApiProperty()
    password: string;

    @ApiProperty()
    recoverToken: string;
}


