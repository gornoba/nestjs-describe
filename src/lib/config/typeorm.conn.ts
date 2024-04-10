import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const TypeOrmConfig = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    const db = JSON.parse(configService.get('POSTGRE'));

    return {
      type: 'postgres',
      host: db.host,
      port: db.port,
      username: db.username,
      password: db.password,
      database: db.database,
      schema: db.schema,
      autoLoadEntities: true,
      entities: [
        join(
          __dirname,
          '..',
          '..',
          'db',
          'entities',
          '**',
          '*.entity{.ts,.js}',
        ),
      ],
      synchronize: true,
      logging: ['error'],
    };
  },
  inject: [ConfigService],
};
