import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { JwtService } from '@nestjs/jwt';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private jwtService: JwtService,
  ) {}

  async findByEmail(email: string): Promise<Patient | null> {
    return await this.patientRepository.findOneBy({ email });
  }

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(patient);
  }

  async verifyDOB(email: string, dateOfBirth: string): Promise<Patient | null> {
    const patient = await this.findByEmail(email);
    if (!patient) return null;

    const dateOfBirthFromDb = new Date(patient.dateOfBirth).toISOString().split('T')[0];
    if (dateOfBirthFromDb !== dateOfBirth) return null;

    return patient;
  }

  async login(email: string, dateOfBirth: string): Promise<{ accessToken: string }> {
    const patient = await this.findByEmail(email);
    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const dateOfBirthFromDb = new Date(patient.dateOfBirth).toISOString().split('T')[0];
    if (dateOfBirthFromDb !== dateOfBirth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: patient.id, email: patient.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
