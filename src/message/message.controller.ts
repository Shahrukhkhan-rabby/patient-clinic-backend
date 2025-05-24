import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { PatientService } from '../patient/patient.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly msgService: MessageService,
    private readonly patientService: PatientService,
  ) {}

  @Post('send')
  async sendMessage(@Body() body: { email: string; content: string }) {
    const patient = await this.patientService.findByEmail(body.email);
    if (!patient) return { success: false, message: 'Patient not found' };

    const message = await this.msgService.createMessage(patient, body.content);
    return { success: true, message };
  }
}
