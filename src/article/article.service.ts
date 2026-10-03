import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import { UpdateArticleDTO } from './dto/update-article.dto.js';
import { Article } from './entities/article.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    userId: string,
    createArticleDTO: CreateArticleDTO,
    file?: Express.Multer.File,
  ): Promise<Article> {
    let image: string | undefined;

    if (file) {
      image = await this.cloudinaryService.uploadImageStream(file);
    }
    const newArticle = this.articleRepository.create({
      ...createArticleDTO,
      image,
      userId,
    });
    return await this.articleRepository.save(newArticle);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find({
      relations: {
        category: true,
        user: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: {
        category: true,
        user: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    });
    if (!article) {
      throw new NotFoundException(`Article dengan ID ${id} tidak ditemukan`);
    }
    return article;
  }

  async update(
    id: string,
    updateArticleDTO: UpdateArticleDTO,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<Article> {
    const currentUser = await this.articleRepository.findOne({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    const article = await this.findOne(id);
    if (!currentUser) {
      throw new ForbiddenException();
    }
    if (file) {
      article.image = await this.cloudinaryService.uploadImageStream(file);
    }

    Object.assign(article, updateArticleDTO);
    return await this.articleRepository.save(article);
  }

  async remove(userId: string, id: string): Promise<void> {
    const currentUser = await this.articleRepository.findOne({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    if (!currentUser) {
      throw new ForbiddenException();
    }
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }
}
