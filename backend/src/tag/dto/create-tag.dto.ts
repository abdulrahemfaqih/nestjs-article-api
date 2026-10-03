import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDTO {
  @ApiProperty({
    example: 'nestjs',
    description: 'Nama tag artikel',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
