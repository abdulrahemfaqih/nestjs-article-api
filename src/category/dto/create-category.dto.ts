import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
