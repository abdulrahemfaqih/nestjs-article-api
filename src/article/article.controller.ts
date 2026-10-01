import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
    return await this.articleService.findAllArticle();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<Article> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  async create(@Body() createArticleDTO: CreateArticleDTO): Promise<Article> {
    return await this.articleService.createArticle(createArticleDTO);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() UpdateArticleDTO: UpdateArticleDTO,
  ): Promise<Article> {
    const article = await this.findOneOrFail(params.id);
    return await this.articleService.updateArticleByParams(
      article,
      UpdateArticleDTO,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: FindOneParams): Promise<void> {
    const article = await this.findOneOrFail(params.id);
    await this.articleService.deleteArticleByParams(article);
  }

  private async findOneOrFail(id: string): Promise<Article> {
    const article = await this.articleService.findOneByParams(id);
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }
}
