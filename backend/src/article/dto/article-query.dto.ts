import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleQueryDTO {
  @ApiPropertyOptional({
    description: 'Pencarian berdasarkan judul artikel (case-insensitive)',
    example: 'nestjs',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan ID Kategori (UUID)',
    example: 'b95095c3-05bc-4a47-a0be-36f7010d0443',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan ID Tag (UUID)',
    example: 'b95095c3-05bc-4a47-a0be-36f7010d0443',
  })
  @IsOptional()
  @IsUUID()
  tagId?: string;

  @ApiPropertyOptional({
    description: 'Nomor halaman',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Jumlah artikel per halaman',
    default: 3,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 3;

  @ApiPropertyOptional({
    description: 'Kolom pengurutan data',
    enum: ['title', 'createdAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['title', 'createdAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Arah pengurutan data (asc / desc)',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
