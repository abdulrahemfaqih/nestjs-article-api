import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller.js';
import { ArticleService } from './article.service.js';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
