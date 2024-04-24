import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CatsModule } from 'src/cats/cats.module';

@Module({
  imports: [CatsModule],
  providers: [CronService],
})
export class CronModule {}
