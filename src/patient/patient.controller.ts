// src/patient/patient.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpException, 
  HttpStatus, 
  Res, 
  UseGuards 
} from '@nestjs/common';
import { Response } from 'express';

import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // Public: get patient info by email (without sensitive info like DOB)
  @Get(':email')
  async getPatient(@Param('email') email: string) {
    const patient = await this.patientService.findByEmail(email);
    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }
    return { email: patient.email, name: patient.name }; // exclude DOB here
  }

  // Public: verify DOB to confirm identity
  @Post('verify')
  async verifyDOB(@Body() body: { email: string; dateOfBirth: string }, @Res() res: Response) {
    const { email, dateOfBirth } = body;
    const patient = await this.patientService.verifyDOB(email, dateOfBirth);

    if (!patient) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    return res.status(HttpStatus.OK).json({
      email: patient.email,
      name: patient.name,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
    });
  }

  // Protected: create patient profile, only accessible with valid JWT token
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    const newPatient = await this.patientService.createPatient(createPatientDto);
    return {
      message: 'Patient created successfully',
      patient: newPatient,
    };
  }
}
