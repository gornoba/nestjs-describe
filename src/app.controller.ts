import {
  BeforeApplicationShutdown,
  Controller,
  Get,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  constructor(private readonly appService: AppService) {}

  onModuleInit() {
    console.log('onModuleInit');
  }

  onApplicationBootstrap() {
    console.log('onApplicationBootstrap');
  }

  onModuleDestroy() {
    console.log('onModuleDestroy');
  }

  beforeApplicationShutdown() {
    console.log('beforeApplicationShutdown');
  }

  onApplicationShutdown(signal?: string) {
    console.log('onApplicationShutdown');
  }

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
