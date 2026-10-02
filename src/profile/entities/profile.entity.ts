import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity.js';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  age: number;

  @Column({
    type: 'text',
  })
  bio: string;

  @Column({
    type: 'uuid',
  })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: Relation<User>;
}
