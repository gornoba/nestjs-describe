import { catsStub } from 'src/cats/dto/cats.dto';

export const CatsRepository = {
  find: jest.fn().mockResolvedValue([catsStub()]),
  upsert: jest.fn().mockReturnValue([catsStub()]),
  delete: jest.fn().mockReturnValue(catsStub()),
  createQueryBuilder: jest.fn(),
};
