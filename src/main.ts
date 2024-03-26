import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

class Application {
  private readonly logger = new Logger(Application.name);
  private port: string;
  private url: string;
  private corsOrigin: string[];

  constructor(private server: NestExpressApplication) {
    this.server = server;
    this.port = process.env.PORT || '8000';
    this.corsOrigin = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : ['*'];
  }

  policy() {
    this.server.enableCors({
      origin: this.corsOrigin,
      credentials: true, // cookie를 사용하기 위해 설정
    });
  }

  async bootstrap() {
    await this.server.listen(this.port);
    this.url = await this.server.getUrl();
  }

  startLog() {
    this.logger.log(
      `Server running on ${this.url.replace(/\[::1\]/, 'localhost')}`,
    );
  }
}

async function init() {
  try {
    const server = await NestFactory.create<NestExpressApplication>(AppModule);
    const app = new Application(server);
    await app.bootstrap();

    app.startLog();
  } catch (error) {
    new Logger('init').error(error);
  }
}

init();
