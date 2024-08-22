import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { GuardGuard } from './guard/guard.guard';

import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }


  @Post('/login')
  login(@Body() loginDto:LoginDto){
    return this.authService.login(loginDto)
  }

  @Post('/register')
  register(@Body() registerDto:RegisterUserDto){
    return this.authService.register(registerDto)
  }
  
  @UseGuards(GuardGuard)
  @Get()
  findAll(@Request() req: Request) {

    const user = req['user']
    return this.authService.findAll();
  }

  @UseGuards(GuardGuard)
  @Get('check-token')
  checkToken(@Request() req:Request) : LoginResponse{
    const user = req['user'] as User
    return{
      user,
      token: this.authService.getJwtToken({id: user._id})
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
