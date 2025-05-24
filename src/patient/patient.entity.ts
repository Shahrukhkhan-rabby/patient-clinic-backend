// src/patient/patient.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Message } from '../message/message.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  dateOfBirth: string; // YYYY-MM-DD format


  @Column({ type: 'text', nullable: true })
  descriptionOfIllness?: string;

  @Column({ type: 'text', nullable: true })
  prescription?: string;

  @OneToMany(() => Message, (message) => message.patient)
  messages: Message[];
}
