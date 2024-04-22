import { Transform } from 'class-transformer';
import { currentTime } from 'src/lib/util/koreatime.util';
import { Column, Entity } from 'typeorm';

@Entity()
export class AbstractSubDocumentEntity {
  @Column({ type: 'bool' })
  active: boolean;

  @Column({ type: 'timestamp' })
  @Transform(({ value }) => currentTime(value))
  createdAt: Date;

  @Column({ type: 'timestamp' })
  @Transform(({ value }) => currentTime(value))
  updatedAt: Date;

  constructor(
    active: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
