import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("increment")
  readonly id: number;

  @Column({ type: "uuid" })
  creator: string;

  @Column({ type: "varchar", length: 40, unique: true })
  name: string;

  @Column({ type: "int", default: 0 })
  sortOrder: number;

  @ManyToOne((type) => User, (user) => user.createdTags, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  })
  @JoinColumn({ name: "creator" })
  user: User;

  @ManyToMany(() => User, (user) => user.tags)
  @JoinTable({ name: "user_tag" })
  users: User[];
}
