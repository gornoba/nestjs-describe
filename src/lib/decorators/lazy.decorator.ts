import { Provider } from '@nestjs/common';
import {
  LazyDecorator,
  WrapParams,
} from '../interfaces/lazy-decorator.interface';
import { Aspect } from './aspect.decorator';
import { createAopDecorator } from './create-aop.decorator';
import { LAZYLOAD } from '../constants/lazy.constant';
import { LazyModuleLoader } from '@nestjs/core';

@Aspect(LAZYLOAD)
export class Lazy
  implements
    LazyDecorator<
      any,
      {
        provider: Function;
        method: string;
      }
    >
{
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  wrap({
    method,
    metadata,
  }: WrapParams<
    any,
    {
      provider: Function;
      method: string;
    }
  >) {
    return async (...args: any) => {
      const { LazyModule } = await import('../../lazy/lazy.module');
      const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);

      const provider = metadata.provider;

      if (!provider.prototype[metadata.method]) {
        throw new Error(`Method ${metadata.method} not found in provider`);
      }

      const instance = moduleRef.get(provider);

      const methodReturn = await method(...args);
      return instance[metadata.method](methodReturn);
    };
  }
}

export const LazyDeco = (metadata: { provider: Function; method: string }) =>
  createAopDecorator(LAZYLOAD, metadata);
