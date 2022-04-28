import {  Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
  }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: 'secret',
        signOptions: {expiresIn: '10000s'},
      })
      
    }),

  ],

  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard,
],
  exports: [AuthService]
})
export class AuthModule {}
