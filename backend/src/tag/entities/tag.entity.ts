import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity.js';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Relation<Article[]>;
}
