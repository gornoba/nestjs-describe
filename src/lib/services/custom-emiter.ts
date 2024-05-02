import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Subject, Observable } from 'rxjs';

export interface EventData {
  sessionId: string;
  payload: any;
}

@Injectable()
export class CustomEmitterService {
  private readonly logger = new Logger(CustomEmitterService.name);
  private eventSubject = new Subject<EventData>();

  getEventObservable(): Observable<EventData> {
    return this.eventSubject.asObservable();
  }

  handleMessage(data: EventData, res?: Response) {
    this.eventSubject.next(data);

    if (res) {
      this.getEventObservable().subscribe({
        next: (resData) => {
          const result = { success: true, data: null };
          if (resData.sessionId === data.sessionId) {
            result.data = resData.payload;
          }
          this.complete();
          res.status(HttpStatus.OK).send(result);
        },
        error: (error) => {
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
