import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const TypeOrmMongoConfig = {
  name: 'mongo',
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    const db = JSON.parse(configService.get('MONGO'));
    const { username, password, host, port, database, authSource } = db;

    const config: TypeOrmModuleOptions = {
      type: 'mongodb',
      url: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`,
      entities: [
        join(
          __dirname,
          '..',
          '..',
          'mongoDb',
          'entities',
          '**',
          '*.entity{.ts,.js}',
        ),
      ],
      synchronize: true,
      logging: ['error'],
    };

    return config;
  },
  inject: [ConfigService],
};
