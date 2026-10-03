import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity.js';
import { Article } from '../article/entities/article.entity.js';
import { CommentService } from './comment.service.js';
import { CommentController } from './comment.controller.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Article]), JwtModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService, TypeOrmModule],
})
export class CommentModule {}
