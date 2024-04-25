import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity({
  name: 'latency',
})
@Index(['url', 'createdAt'])
export class LatencyEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
  })
  sessionId: string;

  @Column({
    type: 'varchar',
  })
  url: string;

  @Column({
    type: 'int',
  })
  latency: number;
}
