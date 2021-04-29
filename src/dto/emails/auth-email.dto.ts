import { ApiProperty } from "@nestjs/swagger";

export class AuthEmailDTO {
    @ApiProperty()
    user: string
    @ApiProperty()
    pass: string
}
