import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CatsService } from './cats.service';

@Injectable()
export class CatsListener {
  constructor(private readonly catsService: CatsService) {}

  @OnEvent('cat.updated', {
    nextTick: true,
    async: true,
    suppressErrors: true,
  })
  async catUpdatedListen(event: any) {
    await this.catsService.update(event.id, event.updateCatDto);
  }
}
