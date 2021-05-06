import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokeDTO } from 'src/dto/poke/create-poke.dto';
import { Poke } from 'src/schemas/poke.schama';

@Injectable()
export class PockService {
    constructor(
        @InjectModel(Poke.name)
        private readonly pokeModel: Model<Poke>
    ) { }

    async create(poke: CreatePokeDTO, userId: string): Promise<CreatePokeDTO> {
        if (await this.pokeModel.findOne({ identifier: poke.identifier })) throw 'Pokemon já cadastrado.'
        poke.userId = userId;
        return this.pokeModel.create(poke)
    }

    async read(userId: string): Promise<CreatePokeDTO[]> {
        return this.pokeModel.find({ userId })
    }

    async deleteOne(identifier: number, userId: string): Promise<CreatePokeDTO> {
        const pokemon = await this.pokeModel.findOne({ identifier, userId })
        if (!pokemon) throw 'Pokemon não encontrado.'
        return pokemon.remove()
    }
}
