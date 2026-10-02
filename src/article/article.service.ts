import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import { UpdateArticleDTO } from './dto/update-article.dto.js';
import { Article } from './entities/article.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDTO: CreateArticleDTO): Promise<Article> {
    const newArticle = this.articleRepository.create(createArticleDTO);
    return await this.articleRepository.save(newArticle);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException(`Article dengan ID ${id} tidak ditemukan`);
    }
    return article;
  }

  async update(
    id: string,
    updateArticleDTO: UpdateArticleDTO,
  ): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDTO);
    return await this.articleRepository.save(article);
  }

  async remove(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }
}
