import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PatientModule } from '../patient/patient.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), PatientModule, ChatModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
