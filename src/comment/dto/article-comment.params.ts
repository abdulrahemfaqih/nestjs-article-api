import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ArticleCommentParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  articleId: string;
}
