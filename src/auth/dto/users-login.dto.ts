import { ApiProperty } from "@nestjs/swagger";

export class UsersLoginDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}