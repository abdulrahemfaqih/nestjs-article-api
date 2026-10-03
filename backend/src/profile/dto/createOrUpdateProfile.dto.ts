import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrUpdateProfileDTO {
  @ApiProperty({ example: 25, description: 'Usia user' })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    example: 'Software Engineer & Tech Enthusiast',
    description: 'Biografi singkat user',
  })
  @IsNotEmpty()
  @IsString()
  bio: string;
}
