import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleService } from './article.service.js';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import { FindOneParams } from './dto/find-one.params.js';
import { UpdateArticleDTO } from './dto/update-article.dto.js';
import { Article } from './entities/article.entity.js';
import { AuthGuard } from '../auth/guard/auth.guard.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/enum/role.enum.js';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return await this.articleService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<Article> {
    return await this.articleService.findOne(params.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Request() request: { user: { sub: string } },
    @UploadedFile() file: Express.Multer.File,
    @Body() createArticleDTO: CreateArticleDTO,
  ): Promise<Article> {
    return await this.articleService.create(
      request.user.sub,
      createArticleDTO,
      file,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Request() request: { user: { sub: string } },
    @UploadedFile() file: Express.Multer.File,
    @Param() params: FindOneParams,
    @Body() updateArticleDTO: UpdateArticleDTO,
  ): Promise<Article> {
    return await this.articleService.update(
      params.id,
      updateArticleDTO,
      request.user.sub,
      file,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() request: { user: { sub: string } },
    @Param() params: FindOneParams,
  ): Promise<void> {
    await this.articleService.remove(request.user.sub, params.id);
  }
}
