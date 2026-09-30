import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ArticleService } from './article.service.js';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import type { IArticle } from './interface/article.interface.js';
import { FindOneParams } from './dto/find-one.params.js';
import { UpdateArticleDTO } from './dto/update-article.dto.js';

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {

    }

    @Get()
    findAll(): IArticle[] {
        return this.articleService.findAllArticle()
    }

    @Get(":id")
    findOne(@Param() params:FindOneParams): IArticle {
        return this.findOneOrFail(params.id)
    }

    @Post()
    create(@Body() createArticleDTO: CreateArticleDTO): IArticle {
        return this.articleService.createArticle(createArticleDTO)
    }

    @Put(":id")
    update(@Param() params:FindOneParams, @Body() UpdateArticleDTO: UpdateArticleDTO): IArticle {
        const article = this.findOneOrFail(params.id)
        return this.articleService.updateArticleByParams(article, UpdateArticleDTO)
    }
    
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param() params: FindOneParams): void {
        const article = this.findOneOrFail(params.id)
        return this.articleService.deleteArticleByParams(article)
        
    }

    private findOneOrFail(id: string) : IArticle {
        const article = this.articleService.findOneByParams(id)
        if (!article) {
            throw new NotFoundException()
        }
        return article
    }



}
