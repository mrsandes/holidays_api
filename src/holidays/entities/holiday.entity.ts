import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { nanoid } from "nanoid";

@Entity('holidays')
export class Holiday {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  date: string;

  @Column({ default: '', nullable: true })
  state?: string;

  @Column({ default: '', nullable: true })
  city?: string;
}
