import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { NextFunction, Request, Response } from 'express';
import { LatencyRepository } from 'src/db/repositories/latency.repository';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly latencyRepository: LatencyRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const url = req.baseUrl;
    const sessionId = req.session.id;
    const method = req.method;

    if (method === 'GET') {
      const cached = await this.cacheManager.get(sessionId);

      if (!cached || (cached && cached !== url)) {
        await this.cacheManager.del(url);
        let latencyCache: number = await this.cacheManager.get(url);

        if (!latencyCache) {
          latencyCache = await this.latencyRepository.meanLatency(url);
          console.log(
            '🚀 ~ RequestMiddleware ~ use ~ latencyCache:',
            latencyCache,
          );
          await this.cacheManager.set(url, latencyCache, 1000 * 60 * 60 * 3);
        }

        await this.cacheManager.set(sessionId, url, latencyCache + 100);
        next();
      } else if (cached === url) {
        res.status(429).json({
          statusCode: 429,
          message: '이전 요청이 끝날때까지 기다려주세요.',
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
