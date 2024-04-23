import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const cacheModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<CacheModuleOptions> => {
    const redis = JSON.parse(configService.get('REDIS'));

    return {
      store: await redisStore({
        url: `redis://${redis.host}:${redis.port}`,
      }),
    };
  },
  inject: [ConfigService],
  isGlobal: true,
};
