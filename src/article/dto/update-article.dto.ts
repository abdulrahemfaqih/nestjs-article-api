import { PartialType } from "@nestjs/mapped-types";
import { CreateArticleDTO } from "./create-article.dto.js";


export class UpdateArticleDTO extends PartialType(CreateArticleDTO) {
    
}