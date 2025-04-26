import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';

@Entity('holidays')
export class Holiday {
  @PrimaryColumn()
  id?: string;

  @Column()
  name?: string;

  @Column()
  type?: string;

  @Column()
  date?: string;

  @Column({ default: '', nullable: true })
  state?: string;

  @Column({ default: '', nullable: true })
  city?: string;

  @BeforeInsert()
  generateId() {
    this.id = `h_${nanoid()}`;
  }
}
