import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "./user-role.enum";

export class CreateUserDTO {
    @ApiProperty()
    name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;

    recoverToken: string;
    role: UserRole;
}


