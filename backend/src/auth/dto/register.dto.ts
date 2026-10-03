import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enum/role.enum.js';

export class RegisterDTO {
  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Alamat email user' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'Secret@123',
    description: 'Password minimal 8 karakter, 1 huruf besar, 1 angka, 1 simbol',
  })
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

  @ApiPropertyOptional({ enum: Role, default: Role.USER, description: 'Role user' })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
