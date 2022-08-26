import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from "../../tags/entities/tag.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  readonly uid: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @Column({ type: "varchar", length: 30, unique: true })
  nickname: string;

  @Column({ type: "varchar", length: 100 })
  password: string;

  @OneToMany((type) => Tag, (tag) => tag.user)
  createdTags: Tag[];

  @ManyToMany(() => Tag, (tag) => tag.users, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  })
  @JoinTable({ name: "user_tag" })
  tags: Tag[];
}
