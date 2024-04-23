import { Aspect } from './aspect.decorator';
import {
  LazyDecorator,
  WrapParams,
} from '../interfaces/lazy-decorator.interface';
import { createAopDecorator } from './create-aop.decorator';
import { Inject } from '@nestjs/common';
import { CACHE } from '../constants/cache.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Aspect(CACHE)
export class CacheDecoFn
  implements
    LazyDecorator<
      any,
      {
        mode: 'get' | 'set' | 'del' | 'reset' | 'wrap';
        ttl?: number;
      }
    >
{
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  wrap({
    method,
    metadata,
  }: WrapParams<
    any,
    {
      mode: 'get' | 'set' | 'del' | 'reset' | 'wrap';
      ttl?: number;
    }
  >) {
    return async (...args: any) => {
      const cacheData: { key: string; value?: any } = await method(...args);

      if (metadata.mode === 'get') {
        return await this.get(cacheData.key);
      } else if (metadata.mode === 'set') {
        return await this.set(cacheData.key, cacheData.value, metadata.ttl);
      } else if (metadata.mode === 'del') {
        return await this.del(cacheData.key);
      } else if (metadata.mode === 'reset') {
        return await this.reset();
      } else if (metadata.mode === 'wrap') {
        return await this.cacheWrap(
          cacheData.key,
          cacheData.value,
          metadata.ttl,
        );
      }
    };
  }

  async get(key: string) {
    return await this.cacheManager.get(key.toString());
  }

  async set(key: string, value: any, ttl?: number) {
    return await this.cacheManager.set(key.toString(), value, ttl * 1000);
  }

  async del(key: string) {
    return await this.cacheManager.del(key.toString());
  }

  async reset() {
    return await this.cacheManager.reset();
  }

  async cacheWrap(key: string, value: any, ttl: number) {
    return await this.cacheManager.wrap(
      key.toString(),
      async () => {
        return value;
      },
      ttl * 1000,
      10 * 60 * 1000,
    );
  }
}

export const CacheDeco = (metadata: {
  mode: 'get' | 'set' | 'del' | 'reset' | 'wrap';
  ttl?: number;
}) => createAopDecorator(CACHE, metadata);
