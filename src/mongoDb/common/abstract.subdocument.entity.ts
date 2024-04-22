import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';
import { AbstractMongoEntity } from './abstract.document.entity';

@Entity()
export class AbstractSubDocumentEntity extends AbstractMongoEntity {
  @Column({ type: 'bool' })
  active: boolean;

  constructor(
    _id: ObjectId = new ObjectId(),
    active: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super();
    this._id = _id;
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
