import { Injectable } from '@nestjs/common';

export const LazyServiceMethods = {
  lazy: 'lazy',
};
@Injectable()
export class LazyService {
  lazy(data: { is: boolean; name: string }) {
    const { is, name } = data;

    return `${name} is ${is ? 'lazy' : 'not lazy'}`;
  }
}
