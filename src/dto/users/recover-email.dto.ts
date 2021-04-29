import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class RecoverEmailDTO {
    @IsEmail({}, { message: 'Esse e-mail não é válido.' })
    @ApiProperty()
    email: string;
}


