import { Controller, Req, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from '../config';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Post } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/guard';
import { User } from './decorators';
import { CurrentUser } from './interfaces/current-user';
import { Token } from './decorators/token.decorator';


@Controller('auth')
export class AuthController {
  constructor(
     @Inject(NATS_SERVICE) private readonly client:ClientProxy) {}

  @Post("register")
  register(@Body() registerUserDto:RegisterUserDto){

   return this.client.send("auth.register.user",registerUserDto).pipe(
    catchError(error=>{
      throw new RpcException(error)
    })
   )
  }

  @Post("login")
  login(@Body() loginUserDto:LoginUserDto){

   return this.client.send("auth.login.user",loginUserDto).pipe(
     catchError(error=>{
      throw new RpcException(error)
    })
   )
  }

  @UseGuards(AuthGuard)
  @Get("verify")
  verify(@User() user:CurrentUser,@Token() token:string){
  
    return {
     user,
     token
    }

  }

}
