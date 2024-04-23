import { catMongoStub } from '../dto/cat.mongo.dto';
import { personMongoStub } from '../dto/person.mongo.dto';

export const MongoService = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue([catMongoStub()]),
  findOne: jest.fn().mockResolvedValue(catMongoStub()),
  create: jest.fn().mockResolvedValue(catMongoStub()),
  deleteAll: jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1,
  }),
  deleteOne: jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1,
  }),
  createPerson: jest.fn().mockResolvedValue(personMongoStub()),
});
