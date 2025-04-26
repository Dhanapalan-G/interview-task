// src/entities/user.entity.ts

import { generateEntityId } from 'src/utils/utility';
import { Entity, Column, BeforeInsert, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'user' })
  role: string; // admin or user

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId('usr');
  }
}
