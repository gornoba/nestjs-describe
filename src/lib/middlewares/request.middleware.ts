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
    const sessionId = req.session.id;
    const url = req.baseUrl;
    const method = req.method;
    const value = `${method}-${url}`;

    const cached = await this.cacheManager.get(sessionId);

    if (!cached || (cached && cached !== value)) {
      // latency cache
      let latencyCache: number = await this.cacheManager.get(value);
      if (!latencyCache) {
        latencyCache = await this.latencyRepository.meanLatency(value);
        await this.cacheManager.set(value, latencyCache, 1000 * 60 * 10);
      }

      // session cache
      await this.cacheManager.set(sessionId, value, latencyCache + 100);
      next();
    } else if (cached === value) {
      res.status(429).json({
        statusCode: 429,
        message: '이전 요청이 끝날때까지 기다려주세요.',
      });
    } else {
      next();
    }
  }
}
