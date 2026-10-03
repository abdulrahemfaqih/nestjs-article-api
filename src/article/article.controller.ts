import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
import { ArticleQueryDTO } from './dto/article-query.dto.js';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Query() query: ArticleQueryDTO) {
    return await this.articleService.findAll(query);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Get('user/my-articles')
  async findMyArticles(
    @Request() request: { user: { sub: string } },
  ): Promise<Article[]> {
    return await this.articleService.findByUserId(request.user.sub);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Article[]> {
    return await this.articleService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<Article> {
    return await this.articleService.findOne(params.id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
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

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
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

  @ApiBearerAuth('JWT-auth')
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
