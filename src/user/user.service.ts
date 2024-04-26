import { CreateUserDto } from './../dto/create-user.dto';
import { BadRequestException, HttpException, Injectable, Res } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { Request, Response } from 'express'; 
@Injectable()
export class UserService { 
  constructor(@InjectRepository(User) private userRepo:Repository<User>, private readonly jwtService:JwtService) {}
  // constructor(@InjectRepository(User) private userRepo:Repository<User>){}
 async create(payload: CreateUserDto) {    
    payload.email = payload.email.toLowerCase();
   const { email, password, ...rest } = payload;
   const isUser = await this.userRepo.findOne({ where: { email } });
   if (isUser) throw new HttpException('sorry user with this email already exist', 400);

   const hashPassword = await bcrypt.hash(password, 10);
   try {
     const user = await this.userRepo.save({ email, password: hashPassword, ...rest });
     delete user.password;
     return user
   } catch (error) {
     if (error.code === '22P02') {
       throw new BadRequestException('admin role should be lowercase')
     }
     return error;
    }
   

    // return 'This action adds a new user'; 
  } 



  async login(payload: LoginDto, @Res()res:Response) {
    const {email, password} = payload;
    const user = await this.userRepo.findOne({where:{email}});
    if(!user){
      throw new HttpException('Invalid credentials', 400)
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      throw new HttpException('Invalid credentials', 400)
    }
    delete user.password
    
    const token = await this.jwtService.signAsync({id: user.id, email: user.email, role: user.role});

    res.cookie('userAuthenticated', token, {httpOnly: true, maxAge: 1 * 60 * 60 * 1000, sameSite:'none', secure:true});

    return res.send({
      message: 'User logged in successfully', 
      userToken: token,
      userDetails: user
    })
  }

  // findAll() {
  //   return `This action returns all user`;
  // } 

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
