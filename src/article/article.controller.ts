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
} from '@nestjs/common';
import { ArticleService } from './article.service.js';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import { FindOneParams } from './dto/find-one.params.js';
import { UpdateArticleDTO } from './dto/update-article.dto.js';
import { Article } from './entities/article.entity.js';

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

  @Post()
  async create(@Body() createArticleDTO: CreateArticleDTO): Promise<Article> {
    return await this.articleService.create(createArticleDTO);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateArticleDTO: UpdateArticleDTO,
  ): Promise<Article> {
    return await this.articleService.update(params.id, updateArticleDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindOneParams): Promise<void> {
    await this.articleService.remove(params.id);
  }
}
