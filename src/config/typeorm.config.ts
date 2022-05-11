import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule.forRoot()],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mongodb',
      url: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uosty.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT, 10),
      // username: process.env.DB_USERNAME,
      // database: 'nestjs-mongodb-demo',
      // password: process.env.DB_PASSWORD,
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
  url: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uosty.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT, 10),
      // username: process.env.DB_USERNAME,
      // database: 'nestjs-mongodb-demo',
      // password: process.env.DB_PASSWORD,
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