import { Controller, Get, Request, Param, ForbiddenException, UseGuards, NotFoundException, UnprocessableEntityException, Post, Delete, Put, Body } from '@nestjs/common';
import { ReadUserDTO } from '../dto/users/read-user.dto';
import { UsersService } from './users.service';
import { UserRole } from '../dto/users/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '../dto/users/create-user.dto';
import { AnswerDTO } from 'src/dto/server/answer.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { };

    @UseGuards(JwtAuthGuard)
    @Get('one')
    @ApiBearerAuth()
    async getOneUser(@Request() req: any): Promise<AnswerDTO<ReadUserDTO>> {
        try {
            const { id } = req.user;
            const data = await (await this.usersService.getUser(id)).getDTO()
            const message = "Usuário encontrado com sucesso!";
            return new AnswerDTO<ReadUserDTO>(message, data);
        } catch (error) {
            throw error.message || error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiBearerAuth()
    async getOne(@Request() req: any, @Param('id') idParam: string): Promise<ReadUserDTO> {
        const { role, id } = req.user;
        let response = null;
        let searchID = idParam;
        if (!idParam.match(/^[0-9a-fA-F]{24}$/)) {
            throw new UnprocessableEntityException();
        }

        switch (role) {
            case UserRole.ADMIN:
                break;
            case UserRole.CLIENT:
                searchID = id;
                break;
            default:
                throw new ForbiddenException();
        }

        try {
            response = await this.usersService.getUser(searchID);
        } catch (error) {
            console.error(error);
            throw error.message || error;
        }

        if (!response) {
            throw new NotFoundException();
        }

        return response.getDTO();
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth()
    async getAll(@Request() req: any): Promise<AnswerDTO<ReadUserDTO[]>> {
        const { role } = req.user;
        try {
            switch (role) {
                case UserRole.ADMIN:
                    const data = await this.usersService.getAllUsers();
                    const message = "Usuários encontrados com sucesso!";
                    return new AnswerDTO<ReadUserDTO[]>(message, data);
                case UserRole.CLIENT:
                    throw new ForbiddenException();
                default:
                    throw new ForbiddenException();
            }

        } catch (error) {
            throw error.message || error;
        }
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDTO): Promise<AnswerDTO<ReadUserDTO>> {
        try {
            const message = "Usuário cadastrado com sucesso!";
            const data = await this.usersService.create(createUserDto);
            return new AnswerDTO<ReadUserDTO>(message, data);
        } catch (error) {
            throw error.message || error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    @ApiBearerAuth()
    async update(@Request() req: any): Promise<AnswerDTO<ReadUserDTO>> {
        try {
            const { id } = req.user;
            const message = "Usuário atualizado com sucesso!";
            const data = await this.usersService.update(id, req.body);
            return new AnswerDTO<ReadUserDTO>(message, data);
        } catch (error) {
            throw error.message || error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    @ApiBearerAuth()
    async delete(@Request() req: any): Promise<any> {
        const { role, id } = req.user;
        try {
            switch (role) {
                case UserRole.ADMIN:
                    return await this.usersService.delete();
                case UserRole.CLIENT:
                    const message = "Usuário deletado com sucesso!";
                    const data = await this.usersService.deleteOne(id);
                    return new AnswerDTO<ReadUserDTO>(message, data);
                default:
                    throw new ForbiddenException();
            }
        } catch (error) {
            console.error(error);
            throw new ForbiddenException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiBearerAuth()
    async deleteOne(@Request() req: any, @Param('id') userId: string): Promise<ReadUserDTO> {
        const { role } = req.user;
        try {
            switch (role) {
                case UserRole.ADMIN:
                    return await this.usersService.deleteOne(userId);
                case UserRole.CLIENT:
                default:
                    throw new ForbiddenException();
            }
        } catch (error) {
            console.error(error);
            throw new ForbiddenException();
        }
    }
}
