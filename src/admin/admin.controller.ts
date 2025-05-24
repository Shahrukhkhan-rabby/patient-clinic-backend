// src/admin/admin.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.adminService.register(createAdminDto.email, createAdminDto.password);
      return { message: 'Admin registered successfully', admin: { id: admin.id, email: admin.email } };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    try {
      return await this.adminService.login(loginAdminDto.email, loginAdminDto.password);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

