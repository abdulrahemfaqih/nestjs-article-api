import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ArticleStatus } from '../enum/article.enums.js';
import { Category } from '../../category/entities/category.entity.js';
import { User } from '../../auth/entities/user.entity.js';

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

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
  })
  status: ArticleStatus;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category
  @Column({
    type: "uuid"
  })
  categoryId: string

  @ManyToOne(() => User, (user) => user.id )
  user: User
  @Column({
    type: "uuid"
  })
  userId: string

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
