import { ApiProperty } from "@nestjs/swagger";

export class AnswerDTO<T> {
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    message: string;
    @ApiProperty()
    data: T;

    constructor(message: string, data: T = undefined) {
        this.success = true;
        this.message = message;
        this.data = data;
    };
}