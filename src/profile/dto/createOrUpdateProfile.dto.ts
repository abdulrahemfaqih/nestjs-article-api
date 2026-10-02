import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrUpdateProfileDTO {
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  bio: string;
}
