import { Injectable, Logger } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
  Timeout,
} from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron('45 * * * * *', {
    name: 'cron-job',
    timeZone: 'Asia/Seoul',
  })
  handleCron() {
    this.logger.debug(`Called when the current second is 45`);
  }

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'cron-job-every-30-seconds',
    timeZone: 'Asia/Seoul',
  })
  handleCronEvery30Seconds() {
    this.logger.debug('Called every 30 seconds');
  }

  @Interval('interval-job', 10000)
  handleInterval() {
    this.logger.debug('Called Interval every 10 seconds');
  }

  @Timeout(60000)
  handleTimeout() {
    this.schedulerRegistry.deleteCronJob('cron-job');
    this.schedulerRegistry.deleteCronJob('cron-job-every-30-seconds');
    this.schedulerRegistry.deleteInterval('interval-job');
    this.logger.debug('Called Timeout after 60 seconds and deleted all jobs');
  }
}
