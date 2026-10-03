import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { ArticleCommentParams } from './dto/article-comment.params.js';
import { FindOneParams } from './dto/find-one.params.js';
import { AuthGuard } from '../auth/guard/auth.guard.js';
import { Role } from '../auth/enum/role.enum.js';
import { Comment } from './entities/comment.entity.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post('article/:articleId/comments')
  async create(
    @Request() request: { user: { sub: string } },
    @Param() params: ArticleCommentParams,
    @Body() createCommentDTO: CreateCommentDTO,
  ): Promise<Comment> {
    return await this.commentService.create(
      request.user.sub,
      params.articleId,
      createCommentDTO,
    );
  }

  @Get('article/:articleId/comments')
  async findByArticle(
    @Param() params: ArticleCommentParams,
  ): Promise<Comment[]> {
    return await this.commentService.findByArticle(params.articleId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('comment/:id')
  async remove(
    @Request() request: { user: { sub: string; role: Role } },
    @Param() params: FindOneParams,
  ): Promise<void> {
    await this.commentService.remove(
      request.user.sub,
      request.user.role,
      params.id,
    );
  }
}
