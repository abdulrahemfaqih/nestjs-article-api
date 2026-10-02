import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../enum/role.enum.js';

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password minimal 8 karakter',
  })
  @Matches(/[A-Z]/, {
    message: 'Password minimal ada 1 Huruf Besar',
  })
  @Matches(/[0-9]/, {
    message: 'Password minimal ada 1 Angka',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password minimal ada 1 karakter spesial',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
