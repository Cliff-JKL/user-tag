import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tag } from "../../tags/entities/tag.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @Column({ type: "varchar", length: 100 })
  email: string;

  @Column({ type: "varchar", length: 30 })
  nickname: string;

  @Column({ type: "varchar", length: 100 })
  password: string;

  @OneToMany((type) => Tag, (tag) => tag.user)
  tags: Tag[];
}
