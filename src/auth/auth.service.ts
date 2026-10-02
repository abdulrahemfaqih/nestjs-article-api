import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto.js';
import { Role } from './enum/role.enum.js';
import { LoginDTO } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDTO: RegisterDTO): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDTO.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashPassword = await bcrypt.hash(registerDTO.password, 10);
    const userCount = await this.userRepository.count();
    const roleUser: Role = userCount === 0 ? Role.ADMIN : Role.USER;
    const newUser = this.userRepository.create({
      name: registerDTO.name,
      email: registerDTO.email,
      password: hashPassword,
      role: roleUser,
    });
    await this.userRepository.save(newUser);
    return {
      message: 'Register user berhasil',
    };
  }

  async loginUser(loginDTO: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDTO.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    if (!(await bcrypt.compare(loginDTO.password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    const { password: _password, ...safeUser } = user;
    return safeUser as Omit<User, 'password'>;
  }
}
