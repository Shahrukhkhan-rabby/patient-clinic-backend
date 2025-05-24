import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';  // import JwtModule here
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    JwtModule,  
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],  
})
export class PatientModule {}
