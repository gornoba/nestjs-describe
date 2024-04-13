import { Injectable } from '@nestjs/common';
import { CatsDto, CreateCatDto, UpdateCatDto } from './dto/cats.dto';
import { TransactionDeco } from 'src/lib/decorators/transaction.decorator';
import { UserRepository } from 'src/db/repositories/user.repository';

@Injectable()
export class CatsService {
  private readonly cats: CatsDto[] = [
    {
      id: 1,
      name: 'Cat1',
      age: 1,
      breed: 'Breed1',
    },
  ];

  constructor(private readonly userRepository: UserRepository) {}

  create(cat: CreateCatDto): CatsDto {
    const total = this.cats.length;

    const cats = new CatsDto({ id: total + 1, ...cat });
    this.cats.push(cats);

    return cats;
  }

  createMany(cats: CreateCatDto[]): CatsDto[] {
    const returnCats: CatsDto[] = [];

    for (const cat of cats) {
      const total = this.cats.length;

      const newCat = new CatsDto({ id: total + 1, ...cat });
      returnCats.push(newCat);
    }
    this.cats.push(...returnCats);

    return returnCats;
  }

  @TransactionDeco()
  async findAll() {
    return await this.userRepository.findAll();
  }

  findOne(id: number): CatsDto {
    return this.cats.find((cat) => cat.id === id);
  }

  update(id: number, cat: UpdateCatDto): CatsDto {
    const index = this.cats.findIndex((cat) => cat.id === id);
    this.cats[index] = new CatsDto(Object.assign(this.cats[index], cat));

    return this.cats[index];
  }

  remove(id: number): CatsDto {
    const index = this.cats.findIndex((cat) => cat.id === id);
    const cat = this.cats[index];
    this.cats.splice(index, 1);

    return cat;
  }
}
