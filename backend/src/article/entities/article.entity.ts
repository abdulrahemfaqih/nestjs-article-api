import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  Index,
  type Relation,
} from 'typeorm';
import { ArticleStatus } from '../enum/article.enums.js';
import { Category } from '../../category/entities/category.entity.js';
import { User } from '../../auth/entities/user.entity.js';
import { Tag } from '../../tag/entities/tag.entity.js';
import { Comment } from '../../comment/entities/comment.entity.js';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
  })
  status: ArticleStatus;

  @ManyToOne(() => Category, (category) => category.articles)
  category: Relation<Category>;
  @Index()
  @Column({
    type: "uuid"
  })
  categoryId: string;

  @ManyToOne(() => User, (user) => user.articles)
  user: Relation<User>;
  @Index()
  @Column({
    type: "uuid"
  })
  userId: string;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Relation<Tag[]>;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Relation<Comment[]>;

  @Index()
  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
