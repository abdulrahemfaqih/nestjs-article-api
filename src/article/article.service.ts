import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import { UpdateArticleDTO } from './dto/update-article.dto.js';
import { Article } from './entities/article.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  // resource
  constructor(
    @InjectRepository(Article)
    private ArticleRepository: Repository<Article>,
  ) {}
  async createArticle(createArticleDTO: CreateArticleDTO): Promise<Article> {
    const newArticle = await this.ArticleRepository.save(createArticleDTO);
    return newArticle;
  }

  async findAllArticle(): Promise<Article[]> {
    return await this.ArticleRepository.find();
  }

  async findOneByParams(id: string): Promise<Article | null> {
    return await this.ArticleRepository.findOne({
      where: { id },
    });
  }

  async updateArticleByParams(
    article: Article,
    UpdateArticleDTO: UpdateArticleDTO,
  ): Promise<Article> {
    Object.assign(article, UpdateArticleDTO);
    return await this.ArticleRepository.save(article);
  }

  async deleteArticleByParams(article: Article): Promise<void> {
    await this.ArticleRepository.delete(article.id);
  }
}
