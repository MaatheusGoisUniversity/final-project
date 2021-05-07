import { Body, Request, Controller, Post, UseGuards, Param, Delete, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePokeDTO } from 'src/dto/poke/create-poke.dto';
import { AnswerDTO } from 'src/dto/server/answer.dto';
import { PockService } from './poke.service';

@ApiTags('Pokemon')
@Controller('api/pokemon')
export class PockController {
    constructor(private readonly pokeService: PockService) { };

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    async create(@Request() req: any, @Body() poke: CreatePokeDTO): Promise<AnswerDTO<CreatePokeDTO>> {
        const { id } = req.user;
        try {
            const message = "Pokemon adicionado com sucesso!";
            const pokeDto = await this.pokeService.create(poke, id);
            return new AnswerDTO<CreatePokeDTO>(message, pokeDto);;
        } catch (error) {
            throw error.message || error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth()
    async read(@Request() req: any): Promise<AnswerDTO<CreatePokeDTO[]>> {
        const { id } = req.user;
        try {
            const message = "Pokemons lidos com sucesso!";
            const pokeDto = await this.pokeService.read(id);
            return new AnswerDTO<CreatePokeDTO[]>(message, pokeDto);;
        } catch (error) {
            throw error.message || error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    @ApiBearerAuth()
    async readList(@Request() req: any): Promise<AnswerDTO<number[]>> {
        const { id } = req.user;
        try {
            const message = "Lista dos pokemons lida com sucesso!";
            const pokeDto = await this.pokeService.readList(id);
            return new AnswerDTO<number[]>(message, pokeDto);;
        } catch (error) {
            throw error.message || error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':identifier')
    @ApiBearerAuth()
    async delete(@Request() req: any, @Param('identifier') identifier: number): Promise<AnswerDTO<CreatePokeDTO>> {
        const { id } = req.user;
        try {
            const message = "Pokemon removido com sucesso!";
            const pokeDto = await this.pokeService.deleteOne(identifier, id);
            return new AnswerDTO<CreatePokeDTO>(message, pokeDto);;
        } catch (error) {
            console.error(error)
            throw error.message || error;
        }
    }
}
