import { Test } from '@nestjs/testing';
import { MongoController } from '../mongo.controller';
import { MongoService } from '../mongo.service';
import { catMongoStub } from '../dto/cat.mongo.dto';

jest.mock('../mongo.service');

describe('MongoController', () => {
  let mongoController: MongoController;
  let mongoService: MongoService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MongoController],
      providers: [MongoService],
    }).compile();

    mongoController = moduleRef.get<MongoController>(MongoController);
    mongoService = moduleRef.get<MongoService>(MongoService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let result: any;

      beforeEach(async () => {
        result = await mongoController.findAll();
      });

      test('mongoService.findAll 호출여부 확인', () => {
        expect(mongoService.findAll).toHaveBeenCalled();
      });

      test('result 반환값 확인', () => {
        expect(result).toEqual([catMongoStub()]);
      });
    });
  });
});
