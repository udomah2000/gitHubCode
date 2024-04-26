import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';


@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
     secret: configService.getOrThrow('JWT_SECRET'),
     signOptions: { 
      algorithm: configService.getOrThrow('JWT_ALGORITHM'),
      expiresIn: configService.getOrThrow<string>('JWT_EXPIRESIN'),
      }

    })
    
    , inject: [ConfigService],
  }),
  PassportModule.register({
    defaultStrategy: 'jwt',
    session: true
  })
  
  
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
