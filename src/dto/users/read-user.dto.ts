import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateUserDTO } from "./create-user.dto";
import { UserRole } from "./user-role.enum";

export class ReadUserDTO extends OmitType(CreateUserDTO, ["password"] as const) {
    @ApiProperty()
    id: string;

    @ApiProperty()
    role: UserRole;
}
