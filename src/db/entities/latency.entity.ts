import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity({
  name: 'latency',
})
@Index(['method_url', 'createdAt'])
export class LatencyEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
  })
  sessionId: string;

  @Column({
    type: 'varchar',
  })
  method_url: string;

  @Column({
    type: 'int',
  })
  latency: number;
}
