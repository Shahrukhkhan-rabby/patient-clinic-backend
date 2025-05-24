import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(email: string, password: string) {
    const exists = await this.adminRepo.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException('Admin already exists');
    }

    const hash = await bcrypt.hash(password, 10);
    const admin = this.adminRepo.create({ email, password: hash });
    return this.adminRepo.save(admin);
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: admin.email, sub: admin.id };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return { access_token };
  }
}
