import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity.js';
import { Article } from '../article/entities/article.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { Role } from '../auth/enum/role.enum.js';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(
    userId: string,
    articleId: string,
    createCommentDTO: CreateCommentDTO,
  ): Promise<Comment> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      select: { id: true },
    });
    if (!article) {
      throw new NotFoundException(`Article dengan ID ${articleId} tidak ditemukan`);
    }

    const newComment = this.commentRepository.create({
      content: createCommentDTO.content,
      articleId,
      userId,
    });

    const savedComment = await this.commentRepository.save(newComment);
    return await this.findOne(savedComment.id);
  }

  async findByArticle(articleId: string): Promise<Comment[]> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      select: { id: true },
    });
    if (!article) {
      throw new NotFoundException(`Article dengan ID ${articleId} tidak ditemukan`);
    }

    return await this.commentRepository.find({
      where: { articleId },
      relations: {
        user: true,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
        },
      },
    });
    if (!comment) {
      throw new NotFoundException(`Comment dengan ID ${id} tidak ditemukan`);
    }
    return comment;
  }

  async remove(userId: string, userRole: Role, id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!comment) {
      throw new NotFoundException(`Comment dengan ID ${id} tidak ditemukan`);
    }

    if (comment.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk menghapus komentar ini',
      );
    }

    await this.commentRepository.remove(comment);
  }
}
