import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bull';

export const bullModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<QueueOptions> => {
    const redis = JSON.parse(configService.get('REDIS'));

    return {
      prefix: 'queue',
      redis: {
        host: redis.host,
        port: redis.port,
      },
      limiter: {
        max: 1000,
        duration: 1000, // 1초동안 최대 1000개 처리
        bounceBack: true, // 대기열 초과시에도 초과시 대기
      },
      defaultJobOptions: {
        priority: 3, // 중간 수준의 우선순위
        delay: 1000, // 1초 후에 작업 처리 시작
        attempts: 3, // 작업이 성공할 때까지 최대 3번 시도
        backoff: {
          type: 'fixed', // 고정된 시간 간격
          delay: 2000, // 실패 후 2초 후에 재시도
        },
        timeout: 30000, // 30초 후에 타임아웃 오류 발생
        removeOnComplete: true, // 작업 완료 후 자동으로 삭제
        removeOnFail: false, // 실패 후 작업을 큐에 유지
        stackTraceLimit: 10, // 스택 트레이스 라인 수 제한
      },
    };
  },
  inject: [ConfigService],
  isGlobal: true,
};
