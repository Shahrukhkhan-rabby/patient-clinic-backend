import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Feature modules
import { PatientModule } from './patient/patient.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // PostgreSQL TypeORM configuration using DATABASE_URL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ Disable in production
      }),
      inject: [ConfigService],
    }),

    // JWT module using secret from .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    PatientModule,
    MessageModule,
    ChatModule,
    AdminModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
