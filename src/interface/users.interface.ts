import { Document } from "mongoose";
import { UserRole } from "src/dto/users/user-role.enum";
import { ReadUserDTO } from "../dto/users/read-user.dto";

export interface IUserDocument extends Document {
    id: string;
    name: string;
    recoverToken: string;
    email: string;
    birth: string;
    cep: string
    sex: string;
    cell: string;
    password: string;
    role: UserRole;
    getDTO(): Promise<ReadUserDTO>
    comparePassword(password: string): boolean
}
