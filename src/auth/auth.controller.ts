import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDTO } from './dto/register.dto.js';
import { LoginDTO } from './dto/login.dto.js';
import { User } from './entities/user.entity.js';
import { AuthGuard } from './guard/auth.guard.js';
import { RolesGuard } from './guard/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';
import { Role } from './enum/role.enum.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDTO: RegisterDTO,
  ): Promise<{ message: string }> {
    return await this.authService.registerUser(registerDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDTO: LoginDTO): Promise<{ access_token: string }> {
    return await this.authService.loginUser(loginDTO);
  }

  @UseGuards(AuthGuard)
  @Get('getuser')
  async getUser(@Request() request: any): Promise<User> {
    return await this.authService.getUser(request.user?.sub);
  }

  @Get('test')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getTest(): { message: string } {
    return {
      message: 'Test role guard berhasil',
    };
  }
}
