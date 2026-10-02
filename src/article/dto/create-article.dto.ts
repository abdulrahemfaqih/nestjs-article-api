import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ArticleStatus } from '../enum/article.enums.js';

export class CreateArticleDTO {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;
}
