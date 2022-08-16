import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "uuid" })
  creator: string;

  @Column({ type: "varchar", length: 40 })
  name: string;

  @Column({ type: "int", default: 0 })
  sortOrder: number;

  @ManyToOne((type) => User, (user) => user.tags, { onDelete: 'CASCADE' })
  user: User;
}
