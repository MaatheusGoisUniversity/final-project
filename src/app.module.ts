import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

const options = {
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  useNewUrlParser: true
};

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:t2KmrKHRqAMtPFb1@finalproject.qohxt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', options),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
