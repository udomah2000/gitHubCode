import { IsEmail, IsNotEmpty, IsString,  Matches, MaxLength, MinLength,  } from "class-validator";
import { userRole } from "src/enum/role.enum";

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;


    @IsNotEmpty()
    @IsString()
    @MinLength(8, {message: 'sorry you must put in 8 characters'})
    @MaxLength(16, {message: 'password should not be more than 16 characters'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,{message:'password must contain atleast one Uppercase, one number and one special key'})
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    role: userRole;
}
