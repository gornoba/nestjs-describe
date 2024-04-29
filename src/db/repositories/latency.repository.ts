import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LatencyEntity } from '../entities/latency.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LatencyRepository {
  constructor(
    @InjectRepository(LatencyEntity)
    private latencyRepository: Repository<LatencyEntity>,
  ) {}

  async createLatency(data: LatencyEntity) {
    return await this.latencyRepository.save(data);
  }

  async meanLatency(method_url: string) {
    const today = new Date();
    const result = await this.latencyRepository
      .createQueryBuilder('latency')
      .select('STDDEV(latency.latency)', 'stddev')
      .where(
        `latency.createdAt between :today::timestamp - interval '1' day AND :today::timestamp`,
        {
          today,
        },
      )
      .andWhere('latency.method_url = :method_url', { method_url })
      .getRawOne();

    return parseInt(result.stddev, 0) || 100;
  }
}
