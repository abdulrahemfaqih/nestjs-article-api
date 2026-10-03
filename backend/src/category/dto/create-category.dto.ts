import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Technology',
    description: 'Nama kategori',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
