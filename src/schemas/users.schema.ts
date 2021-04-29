import * as bcrypt from 'bcryptjs';
import { ReadUserDTO } from '../dto/users/read-user.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserDocument } from 'src/interface/users.interface';
import { Document } from 'mongoose';
import { UserRole } from 'src/dto/users/user-role.enum';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string

    @Prop()
    recoverToken: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true, default: UserRole.CLIENT })
    role: UserRole

    // @Prop()
    // cars: Car[]

    getDTO(): ReadUserDTO { return }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = function (password: string): boolean {
    if (bcrypt.compareSync(password, this.password)) return true;
    return false;
};

UserSchema.pre<IUserDocument>("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password);
    }
    next()
});

UserSchema.methods.getDTO = function (): ReadUserDTO {
    const dto = new ReadUserDTO();
    dto.id = this.id;
    dto.name = this.name;
    dto.recoverToken = this.recoverToken;
    dto.email = this.email;
    dto.role = this.role;

    return dto;
};