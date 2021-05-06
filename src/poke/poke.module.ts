import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Poke, PokeSchema } from 'src/schemas/poke.schama';
import { PockController } from './poke.controller';
import { PockService } from './poke.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Poke.name, schema: PokeSchema }]),
  ],
  controllers: [PockController],
  providers: [PockService]
})
export class PokeModule { }
