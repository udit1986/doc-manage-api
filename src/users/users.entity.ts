import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordTransformer } from './password.transformer';
import { BaseEntity } from '../common/entity/base.entity';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password: string;

  @Column({ type: 'int', default: 3 })
  role: number;

}

export class UserFillableFields {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
