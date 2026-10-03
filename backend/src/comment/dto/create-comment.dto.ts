import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDTO {
  @ApiProperty({
    example: 'Artikel yang sangat informatif dan bermanfaat!',
    description: 'Isi teks komentar',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
