import { Injectable } from '@nestjs/common';
import { CatsDto, CreateCatDto, UpdateCatDto } from './dto/cats.dto';
import { TransactionDeco } from 'src/lib/decorators/transaction.decorator';
import { CatsRepository } from '../db/repositories/cat.repository';
import { CatsEntity } from 'src/db/entities/cat.entity';

@Injectable()
export class CatsService {
  private readonly cats: CatsDto[] = [];

  constructor(private readonly catsRepository: CatsRepository) {}

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
    return (await await this.catsRepository.find(CatsEntity, {
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
}
