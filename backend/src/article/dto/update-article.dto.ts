import { PartialType } from '@nestjs/swagger';
import { CreateArticleDTO } from './create-article.dto.js';

export class UpdateArticleDTO extends PartialType(CreateArticleDTO) {}
