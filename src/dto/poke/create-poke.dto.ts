import { ApiProperty } from "@nestjs/swagger";

export class CreatePokeDTO {
    @ApiProperty()
    identifier: number

    userId: string

    @ApiProperty()
    name: string

    @ApiProperty()
    imageUrl: string

    @ApiProperty()
    type: string

    @ApiProperty()
    height: number

    @ApiProperty()
    weight: number

    @ApiProperty()
    abilities: string[]

    @ApiProperty({ type: [Number] })
    stats: number[]
}


