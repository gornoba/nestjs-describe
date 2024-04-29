import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, of, tap } from 'rxjs';
import { LatencyRepository } from 'src/db/repositories/latency.repository';
import { LatencyEntity } from 'src/db/entities/latency.entity';

@Injectable()
export class LatencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LatencyInterceptor.name);

  constructor(private readonly latencyRepository: LatencyRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const req = context.switchToHttp().getRequest();
    const start = performance.now();
    const sessionId = req.session.id;
    const method = req.method;
    const url = req.url;

    return next.handle().pipe(
      tap(() => {
        if (method === 'GET') {
          const elapsedTime: number = performance.now() - start;
          const entity = new LatencyEntity();
          entity.sessionId = sessionId;
          entity.method_url = `${method}-${url}`;
          entity.latency = Math.floor(elapsedTime);

          this.latencyRepository
            .createLatency(entity)
            .catch((error) => this.logger.error(error));
        }
      }),
      catchError((error) => {
        return of(error);
      }),
    );
  }
}
