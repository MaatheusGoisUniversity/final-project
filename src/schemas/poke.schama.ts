import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Poke extends Document {
    @Prop()
    identifier: number

    @Prop()
    userId: string

    @Prop()
    name: string

    @Prop()
    imageUrl: string

    @Prop()
    type: string

    @Prop()
    height: number

    @Prop()
    weight: number

    @Prop()
    abilities: string[]

    @Prop()
    stats: number[]
}

export const PokeSchema = SchemaFactory.createForClass(Poke);
