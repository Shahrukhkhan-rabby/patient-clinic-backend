import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Patient } from '../patient/patient.entity';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    private chatGateway: ChatGateway,
  ) {}

  async createMessage(patient: Patient, content: string): Promise<Message> {
    const msg = this.messageRepo.create({ patient, content });
    const savedMsg = await this.messageRepo.save(msg);

    // Notify clinic via socket
    this.chatGateway.sendNotification('clinic-room', `New message from patient: ${patient.email}`);

    return savedMsg;
  }

  async getMessagesForPatient(patientId: number): Promise<Message[]> {
    return this.messageRepo.find({
      where: { patient: { id: patientId } },
      order: { createdAt: 'DESC' },
    });
  }
}
