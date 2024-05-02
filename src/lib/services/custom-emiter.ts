import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Subject, Observable } from 'rxjs';

export interface EventData {
  sessionId: string;
  subject?: string;
  payload?: any;
}

@Injectable()
export class CustomEmitterService {
  private readonly logger = new Logger(CustomEmitterService.name);
  private eventSubject = new Subject<EventData>();
  private activeSubscriptions = 0;
  private maxSubscriptions = 10;

  getEventObservable(): Observable<EventData> {
    this.activeSubscriptions++;
    return this.eventSubject.asObservable();
  }

  handleMessage(data: EventData, res?: Response) {
    this.eventSubject.next(data);

    if (res) {
      const subscribe = this.getEventObservable().subscribe({
        next: (resData) => {
          if (this.activeSubscriptions > this.maxSubscriptions) {
            res
              .status(HttpStatus.TOO_MANY_REQUESTS)
              .send({ success: false, message: 'Too many listeners' });
          } else {
            const result = { success: true, data: null };
            if (resData.sessionId === data.sessionId) {
              result.data = resData.payload;
            }
            subscribe.unsubscribe();
            this.activeSubscriptions--;
            res.status(HttpStatus.OK).send(result);
          }
        },
        error: (error) => {
          this.activeSubscriptions--;
          this.handleError(error);
        },
      });
    }
  }

  handleError(error: any) {
    this.eventSubject.error(error);
    this.logger.error('An error occurred', error);
  }

  complete() {
    this.eventSubject.complete();
  }
}
