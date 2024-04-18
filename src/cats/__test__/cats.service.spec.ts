import { CatsRepository } from 'src/db/repositories/cat.repository';
import { CatsService } from '../cats.service';
import { Test } from '@nestjs/testing';
import { CatsEntity } from 'src/db/entities/cat.entity';
import { catsStub, createCatStub } from '../dto/cats.dto';

jest.mock('src/db/repositories/cat.repository');

describe('CatsService', () => {
  let catsService: CatsService;
  let catsRepository: CatsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: CatsRepository,
          useValue: CatsRepository,
        },
      ],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsRepository = moduleRef.get<CatsRepository>(CatsRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let cat: CatsEntity[] | CatsEntity;

      beforeEach(async () => {
        cat = await catsService.create(createCatStub());
      });

      test('catsRepository.upsert 호출여부 확인', () => {
        expect(catsRepository.upsert).toHaveBeenCalled();
      });

      test('catsRepository.upsert 호출시 CatsEntity, [cat] 전달 확인', () => {
        expect(catsRepository.upsert).toHaveBeenCalledWith(CatsEntity, [
          createCatStub(),
        ]);
      });

      test('cat 반환값 확인', () => {
        expect(cat).toEqual([{ id: expect.any(Number), ...createCatStub() }]);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let cat: CatsEntity;

      beforeEach(async () => {
        cat = await catsService.findOne(1);
      });

      test('catsRepository.find 호출여부 확인', () => {
        expect(catsRepository.find).toHaveBeenCalled();
      });

      test('catsRepository.find 호출시 CatsEntity, { where: { id } } 전달 확인', () => {
        expect(catsRepository.find).toHaveBeenCalledWith(CatsEntity, {
          where: { id: 1 },
        });
      });

      test('cat 반환값 확인', () => {
        expect(cat).toContainEqual(catsStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let cats: CatsEntity[];

      beforeEach(async () => {
        cats = await catsService.findAll();
      });

      test('catsRepository.find 호출여부 확인', () => {
        expect(catsRepository.find).toHaveBeenCalled();
      });

      test('catsRepository.find 호출시 CatsEntity 전달 확인', () => {
        expect(catsRepository.find).toHaveBeenCalledWith(CatsEntity);
      });

      test('cats 반환값 확인', () => {
        expect(cats).toEqual([catsStub()]);
      });
    });
  });
});
