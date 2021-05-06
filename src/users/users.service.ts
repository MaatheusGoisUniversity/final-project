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
    ) { }

    async validateUser(usersLoginDto: UsersLoginDto): Promise<ReadUserDTO> {
        const user = await this.userModel.findOne({ email: usersLoginDto.email });
        if (user && (user.comparePassword(usersLoginDto.password))) {
            return user.getDTO();
        } else {
            throw "Usuário ou senha não conferem.";
        }
    }

    async getUser(userid: string): Promise<IUserDocument> {
        if (!Types.ObjectId.isValid(userid)) throw 'Id do usuário não é válido!'
        const user = await this.userModel.findById(userid);
        if (user) {
            return user;
        } else {
            throw "Usuário não foi encontrado!";
        }
    }

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

    async getAllUsers(): Promise<ReadUserDTO[]> {
        const users = await this.userModel.find();
        const usersDTO: ReadUserDTO[] = [];
        for (let i = 0; i < users.length; i++) {
            usersDTO.push(await users[i].getDTO());
        }
        return usersDTO;
    }

    async create(user: CreateUserDTO): Promise<ReadUserDTO> {
        if (await this.userModel.findOne({ email: user.email })) throw 'E-mail já cadastrado'
        user.role = UserRole.CLIENT
        return (await this.userModel.create(user)).getDTO();
    }

    async update(userID: string, user: IUserDocument): Promise<ReadUserDTO> {
        return (await this.userModel.findByIdAndUpdate(userID, user)).getDTO();
    }

    async delete(): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return this.userModel.deleteMany({});
    }

    async deleteOne(userId: string): Promise<ReadUserDTO> {
        return (await this.userModel.findByIdAndDelete(userId)).getDTO();
    }
}
