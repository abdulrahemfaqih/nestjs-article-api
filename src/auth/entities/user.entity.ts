import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enum/role.enum.js';
import { Profile } from '../../profile/entities/profile.entity.js';
import { Article } from '../../article/entities/article.entity.js';
import { Comment } from '../../comment/entities/comment.entity.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Relation<Profile>;

  @OneToMany(() => Article, (article) => article.user)
  articles: Relation<Article[]>;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Relation<Comment[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
