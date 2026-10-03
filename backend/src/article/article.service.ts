import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import { UpdateArticleDTO } from './dto/update-article.dto.js';
import { Article } from './entities/article.entity.js';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { ArticleQueryDTO } from './dto/article-query.dto.js';
import { Tag } from '../tag/entities/tag.entity.js';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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

    const { tagIds, ...articleData } = createArticleDTO;

    let tags: Tag[] = [];
    if (tagIds && tagIds.length > 0) {
      tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    const newArticle = this.articleRepository.create({
      ...articleData,
      image,
      userId,
      tags,
    });
    return await this.articleRepository.save(newArticle);
  }

  async findAll(query: ArticleQueryDTO) {
    const {
      title,
      categoryId,
      tagId,
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // pagination
    const skip = (page - 1) * limit;
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.tags', 'tag');

    // search
    if (title) {
      queryBuilder.andWhere('article.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (tagId) {
      queryBuilder.andWhere('tag.id = :tagId', {
        tagId,
      });
    }

    // relasi
    const [data, total] = await queryBuilder
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)
      .select([
        'article',
        'category.id',
        'category.name',
        'user.id',
        'user.name',
        'user.email',
        'tag.id',
        'tag.name',
      ])
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findByUserId(userId: string): Promise<Article[]> {
    return await this.articleRepository.find({
      where: {
        userId,
      },
      relations: {
        category: true,
        tags: true,
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
        tags: {
          id: true,
          name: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: {
        category: true,
        user: true,
        tags: true,
        comments: {
          user: true,
        },
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
        tags: {
          id: true,
          name: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            id: true,
            name: true,
          },
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

    const { tagIds, ...articleData } = updateArticleDTO;
    if (tagIds !== undefined) {
      article.tags =
        tagIds.length > 0
          ? await this.tagRepository.findBy({ id: In(tagIds) })
          : [];
    }

    Object.assign(article, articleData);
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
