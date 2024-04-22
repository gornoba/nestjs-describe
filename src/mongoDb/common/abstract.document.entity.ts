import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { currentTime } from 'src/lib/util/koreatime.util';
import {
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AbstractMongoEntity {
  @ObjectIdColumn()
  @Transform(
    ({ value }) => (value instanceof ObjectId ? value.toHexString() : value),
    { toPlainOnly: true },
  )
  _id: ObjectId;

  @CreateDateColumn({
    type: 'timestamp',
  })
  @Transform(({ value }) => currentTime(value))
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  @Transform(({ value }) => currentTime(value))
  updatedAt: Date;
}
