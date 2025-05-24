import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from '../patient/patient.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.messages)
  patient: Patient;

  @Column()
  content: string;

  @Column({ default: false })
  seenByClinic: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
