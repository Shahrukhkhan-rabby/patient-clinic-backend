import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { PatientModule } from './patient/patient.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    // Load env vars globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM config with env variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')) || 3306,
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    PatientModule,
    MessageModule,
    ChatModule,
    AdminModule,

    // JwtModule config with env secret
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
