import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mongodb',
      url: 'mongodb+srv://chuongnvt:chuongnvt@cluster0.uosty.mongodb.net/nestjs-mongodb-demo?retryWrites=true&w=majority',
      // host: process.env.TYPEORM_HOST,
      // port: parseInt(process.env.TYPEORM_PORT, 10),
      // username: process.env.TYPEORM_USERNAME,
      // database: 'nestjs-mongodb-demo',
      // password: process.env.TYPEORM_PASSWORD,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //   migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    //   cli: {
    //     migrationsDir: __dirname + '/../migrations',
    //   },
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: true,
      logging: true,
    };
  },
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: 'mongodb+srv://chuongnvt:chuongnvt@cluster0.uosty.mongodb.net/nestjs-mongodb-demo?retryWrites=true&w=majority',
      // host: process.env.TYPEORM_HOST,
      // port: parseInt(process.env.TYPEORM_PORT, 10),
      // username: process.env.TYPEORM_USERNAME,
      // database: 'nestjs-mongodb-demo',
      // password: process.env.TYPEORM_PASSWORD,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   migrations: [__dirname + '/../migrations/*{.ts,.js}'],
//   cli: {
//     migrationsDir: __dirname + '/../migrations',
//   },
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  synchronize: true,
  logging: true,
};