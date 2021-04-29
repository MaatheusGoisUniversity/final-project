import { ResetPasswordDTO } from './../dto/users/reset-password.dto';
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersLoginDto } from 'src/auth/dto/users-login.dto';
import { UserRole } from 'src/dto/users/user-role.enum';
import { IUserDocument } from 'src/interface/users.interface';
import { User } from 'src/schemas/users.schema';
import { CreateUserDTO } from '../dto/users/create-user.dto';
import { ReadUserDTO } from '../dto/users/read-user.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<IUserDocument>,
    ) {
        // this.delete()
    }
    /**
     * Função utilizada para validar um usuário no sistema.
     *
     * @param username string que identifica o usuário
     * @param password senha não criptografada (necessita implementar criptografia)
     *
     * @returns retorna um objeto User correspondente as credenciais ou null, caso não exista
     */
    async validateUser(usersLoginDto: UsersLoginDto): Promise<ReadUserDTO> {
        const user = await this.userModel.findOne({ email: usersLoginDto.email });
        if (user && (user.comparePassword(usersLoginDto.password))) {
            return user.getDTO();
        } else {
            throw "Usuário ou senha não conferem.";
        }
    }

    /**
     * Busca um usuário pelo seu ID
     *
     * @param userId identificador numérico único do usuário
     *
     * @returns retorna um objeto User correspondente ao ID ou null, caso não exista
     */
    async getUser(userid: string): Promise<IUserDocument> {
        if (!Types.ObjectId.isValid(userid)) throw 'Id do usuário não é válido!'
        const user = await this.userModel.findById(userid);
        if (user) {
            return user;
        } else {
            throw "Usuário não foi encontrado!";
        }
    }

    /**
     * Recovery e-mail por seu e-mail
     *
     * @param email identificador numérico único do usuário
     *
     * @returns retorna um objeto User correspondente ao ID ou null, caso não exista
     */
    async recovery(email: string): Promise<ReadUserDTO> {
        const user = await this.userModel.findOne({ email });
        user.recoverToken = randomBytes(3).toString('hex').toUpperCase();
        await user.save();
        if (user) {
            return user.getDTO();
        } else {
            throw "Usuário não foi encontrado!";
        }
    }

    /**
     * Password reset 
     *
     * @param email identificador numérico único do usuário
     *
     * @returns retorna um objeto User correspondente ao ID ou null, caso não exista
     */
    async resetPassword(reset: ResetPasswordDTO): Promise<ReadUserDTO> {
        const user = await this.userModel.findOne({ email: reset.email });
        if (user.recoverToken != reset.recoverToken) throw 'Token de recuperação inválido.'
        user.password = reset.password;
        await user.save();
        if (user) {
            return user.getDTO();
        } else {
            throw "Usuário não foi encontrado!";
        }
    }



    /**
     * Busca todos os usuários
     *
     * @returns retorna um array de objeto User correspondente ao ID ou null, caso não exista
     */
    async getAllUsers(): Promise<ReadUserDTO[]> {
        const users = await this.userModel.find();
        const usersDTO: ReadUserDTO[] = [];
        for (let i = 0; i < users.length; i++) {
            usersDTO.push(await users[i].getDTO());
        }
        return usersDTO;
    }

    /**
     * Cria um novo usuario
     *
     * @param User identificador numérico único do usuário
     *
     * @returns retorna o usuario caso consiga criar ou erro caso contrario
     */
    async create(user: CreateUserDTO): Promise<ReadUserDTO> {
        if (await this.userModel.findOne({ email: user.email })) throw 'E-mail já cadastrado'
        user.role = UserRole.CLIENT
        return (await this.userModel.create(user)).getDTO();
    }

    /**
     * Atualiza um usuario pelo id
     *
     * @param IUserDocument identificador numérico único do usuário
     *
     * @returns retorna um objeto do tipo ReadUserDTO caso consiga atualizar ou erro caso contrario
     */
    async update(userID: string, user: IUserDocument): Promise<ReadUserDTO> {
        return (await this.userModel.findByIdAndUpdate(userID, user)).getDTO();
    }

    /**
    * Deleta todos os usuarios
    *
    * @returns retorna informacoes sobre os documentos deletados
    */
    async delete(): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return this.userModel.deleteMany({});
    }

    /**
     * Deleta un usuario pelo id
     *
     * @param userId identificador numérico único do usuário
     *
     * @returns retorna informacoes sobre os documentos deletados
     */
    async deleteOne(userId: string): Promise<ReadUserDTO> {
        return (await this.userModel.findByIdAndDelete(userId)).getDTO();
    }
}
