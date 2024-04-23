import { Injectable } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CacheDeco } from 'src/lib/decorators/cache.decorator';

@Injectable()
export class CatsCacheService {
  constructor(private readonly catsService: CatsService) {}

  @CacheDeco({ mode: 'get' })
  async findOne(id: number) {
    return { key: id };
  }

  @CacheDeco({ mode: 'wrap', ttl: 10 * 60 })
  async wrap(id: number, value: any) {
    return { key: id, value };
  }
}
