import { ApiProperty } from "@nestjs/swagger";
import { AuthEmailDTO } from "./auth-email.dto";

export class SendEmailDTO {
    @ApiProperty()
    from: string;

    @ApiProperty()
    to: string[];

    @ApiProperty()
    subject: string;

    @ApiProperty()
    text: string;

    @ApiProperty()
    html: string;

    @ApiProperty()
    auth: AuthEmailDTO
}
