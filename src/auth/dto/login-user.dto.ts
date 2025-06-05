import { IsEmail, IsString, MaxLength, MinLength } from "class-validator"

export class LoginUserDto{

    @IsString()
    @IsEmail()
    email:string 

    @IsString()
    password:string
}