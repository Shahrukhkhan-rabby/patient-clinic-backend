import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  descriptionOfIllness?: string;

  @IsString()
  @IsOptional()
  prescription?: string;
}
