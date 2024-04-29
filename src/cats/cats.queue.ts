import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CatsService } from './cats.service';

@Processor('cats')
export class CatsQueue {
  constructor(private readonly catsService: CatsService) {}

  @Process('findAll')
  async findAll(job: Job) {
    if (job.data === 'findAll') {
      const result = await this.catsService.findAll();
      return result;
    }
    return [];
  }
}
