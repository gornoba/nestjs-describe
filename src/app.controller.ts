import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('sleep')
  async sleep(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return 'sleep';
  }
}
