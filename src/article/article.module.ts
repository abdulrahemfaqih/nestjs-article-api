import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller.js';
import { ArticleService } from './article.service.js';
import { Article } from './entities/article.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), JwtModule],
  controllers: [ArticleController],
  providers: [ArticleService, CloudinaryService],
})
export class ArticleModule {}
