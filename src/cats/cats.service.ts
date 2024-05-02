import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dto/cats.dto';
import { TransactionDeco } from 'src/lib/decorators/transaction.decorator';
import { CatsRepository } from '../db/repositories/cat.repository';
import { CatsEntity } from 'src/db/entities/cat.entity';
import { LazyDeco } from 'src/lib/decorators/lazy.decorator';
import { LazyService, LazyServiceMethods } from 'src/lazy/lazy.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomEmitterService } from 'src/lib/services/custom-emiter';

@Injectable()
export class CatsService implements OnModuleInit {
  constructor(
    private readonly catsRepository: CatsRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly customEmitterService: CustomEmitterService,
  ) {}

  onModuleInit() {
    this.customEmitterService.getEventObservable().subscribe({
      next: async (data) => {
        if (data?.subject) {
          const subject = data.subject as string;
          const subjectSplit = subject.split(/\./);

          if (
            subjectSplit[0] === CatsService.name &&
            this[subjectSplit[1]] instanceof Function
          ) {
            const result = await this[subjectSplit[1]]();
            this.customEmitterService.handleMessage({
              sessionId: data.sessionId,
              payload: result,
            });
          }
        }
      },
      error: (error) => {
        this.customEmitterService.handleError(error);
      },
    });
  }

  @TransactionDeco()
  async create(cat: CreateCatDto): Promise<CatsEntity | CatsEntity[]> {
    return await this.catsRepository.upsert(CatsEntity, [cat]);
  }

  @TransactionDeco()
  async createMany(cats: CreateCatDto[]): Promise<CatsEntity | CatsEntity[]> {
    return await this.catsRepository.upsert(CatsEntity, cats);
  }

  @TransactionDeco()
  async findAll(): Promise<CatsEntity[]> {
    return (await this.catsRepository.find(CatsEntity)) as CatsEntity[];
  }

  @TransactionDeco()
  async findOne(id: number): Promise<CatsEntity> {
    return (await this.catsRepository.find(CatsEntity, {
      where: { id },
    })) as CatsEntity;
  }

  @TransactionDeco()
  async update(
    id: number,
    cat: UpdateCatDto,
  ): Promise<CatsEntity | CatsEntity[]> {
    return await this.catsRepository.upsert(CatsEntity, [{ id, ...cat }]);
  }

  @TransactionDeco()
  async remove(id: number): Promise<CatsEntity> {
    return await this.catsRepository.delete(CatsEntity, id);
  }

  async updateEmit(id: number, cat: UpdateCatDto) {
    this.eventEmitter.emit('cat.updated', { id, ...cat });
  }

  @LazyDeco({
    provider: LazyService,
    method: LazyServiceMethods.lazy,
  })
  async lazy() {
    return { is: true, name: '나나나나' };
  }
}
