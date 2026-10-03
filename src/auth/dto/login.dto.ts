import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email terdaftar',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'Secret@123',
    description: 'Password akun',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}