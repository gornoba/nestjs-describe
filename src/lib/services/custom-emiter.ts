import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

interface EventData {
  type: string;
  payload: any;
}

@Injectable()
export class CustomEmitterService implements OnModuleInit {
  private readonly logger = new Logger(CustomEmitterService.name);
  private eventSubject = new Subject<EventData>();

  onModuleInit() {
    this.handleMessage({ type: 'Greeting', payload: 'Hello World!' });
  }

  getEventObservable(): Observable<EventData> {
    return this.eventSubject.asObservable();
  }

  handleMessage(data: EventData) {
    this.eventSubject.next(data);
  }

  handleError(error: any) {
    this.eventSubject.error(error);
    this.logger.error('An error occurred', error);
  }

  complete() {
    this.eventSubject.complete();
  }
}
