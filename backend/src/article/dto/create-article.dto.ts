import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '../enum/article.enums.js';

export class CreateArticleDTO {
  @ApiProperty({
    example: 'Belajar NestJS untuk Pemula',
    description: 'Judul artikel',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Konten artikel lengkap dan mendalam...',
    description: 'Isi konten artikel',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
    description: 'Status publikasi artikel',
  })
  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @ApiProperty({
    example: 'b95095c3-05bc-4a47-a0be-36f7010d0443',
    description: 'ID Kategori artikel (UUID)',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'File gambar thumbnail artikel',
  })
  image?: any;

  @ApiPropertyOptional({
    example: ['b95095c3-05bc-4a47-a0be-36f7010d0443'],
    description: 'Daftar ID Tag yang terkait (array of UUID)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return value.split(',').map((item: string) => item.trim());
      }
    }
    return value;
  })
  tagIds?: string[];
}
