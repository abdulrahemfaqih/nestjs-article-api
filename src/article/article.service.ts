import { Injectable } from '@nestjs/common';
import { IArticle } from './interface/article.interface.js';
import { CreateArticleDTO } from './dto/create-article.dto.js';
import { randomUUID } from 'crypto';
import { UpdateArticleDTO } from './dto/update-article.dto.js';

@Injectable()
export class ArticleService {
    // resource
    private article: IArticle[] = []

    createArticle(createArticleDTO: CreateArticleDTO) {
        const article: IArticle = {
            id: randomUUID(),
            ...createArticleDTO
        }
        this.article.push(article)
        return article
    }

    findAllArticle(): IArticle[] {
        return this.article
    }

    findOneByParams(id: string): IArticle | undefined {
        return this.article.find(item => item.id === id )
    }

    updateArticleByParams(article: IArticle, UpdateArticleDTO: UpdateArticleDTO): IArticle {
        Object.assign(article, UpdateArticleDTO)
        return article
    }

    deleteArticleByParams(article: IArticle): void {
        this.article = this.article.filter((filterData) => filterData.id != article.id)
    }
}
