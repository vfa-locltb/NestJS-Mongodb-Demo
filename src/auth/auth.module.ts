import {  forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt.guards'
import { RolesGuard } from './guards/roles.guards';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.S_KEY,
        signOptions: {expiresIn: '10000s'},
      }),
    }),

  ],

  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard,JwtStrategy
],
  exports: [AuthService]
})
export class AuthModule {}
