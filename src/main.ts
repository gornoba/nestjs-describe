import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import dotenv from 'dotenv';
import helmet, { contentSecurityPolicy } from 'helmet';
import session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';

dotenv.config();

class Application {
  private readonly logger = new Logger(Application.name);
  private port: string;
  private url: string;
  private corsOrigin: string[];
  private directives: {
    'default-src': string[];
    'script-src': string[];
  } = {
    'default-src': [],
    'script-src': [],
  };
  private sessionSecret: string;
  private swaggerAuthInfo: {
    user: string;
    password: string;
  };

  constructor(private server: NestExpressApplication) {
    this.server = server;

    !process.env.SESSION_SECRET &&
      this.logger.error('session secret 설정이 필요합니다!'); // 세션 비밀 설정이 없는 경우 에러 출력
    this.port = process.env.PORT || '8000';
    this.corsOrigin = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : ['*'];
    process.env.DEFAULT_SRC?.split(',').forEach((src) =>
      this.directives['default-src'].push(src.trim()),
    );
    process.env.SCRIPT_SRC?.split(',').forEach((src) =>
      this.directives['script-src'].push(src.trim()),
    );
    this.sessionSecret = process.env.SESSION_SECRET || 'secret';
    this.swaggerAuthInfo = process.env.SWAGGER_AUTH
      ? JSON.parse(process.env.SWAGGER_AUTH)
      : { user: 'admin', password: '123' };
  }

  private policy() {
    this.server.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            ...contentSecurityPolicy.getDefaultDirectives(), // 기본 정책
            ...this.directives, // 추가 정책 설정
          },
        },
      }),
    );

    this.server.enableCors({
      origin: this.corsOrigin,
      credentials: true, // cookie를 사용하기 위해 설정
    });

    this.server.setGlobalPrefix('api');
  }

  private session() {
    this.server.use(
      session({
        secret: Buffer.from(this.sessionSecret).toString('base64'), // 세션을 안전하게 유지하기 위한 비밀
        resave: false, // 세션에 변경사항이 없으면 다시 저장하지 않음
        saveUninitialized: false, // 초기화되지 않은 세션을 스토어에 저장하지 않음
        cookie: {
          secure: process.env.ENV === 'production', // https 프로토콜을 사용하는 경우 true
          httpOnly: true, // 클라이언트에서 쿠키를 확인하지 못하도록 함
          maxAge: 1000 * 60 * 60, // 쿠키 유효 시간
          sameSite: 'none', // 쿠키 전송 위치 설정
        },
      }),
    );
  }

  private nestLib() {
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true, // 요청 데이터를 해당 타입으로 변환
        skipNullProperties: false, // null 값을 건너뛰지 않음
        skipMissingProperties: false, // 누락된 속성을 건너뛰지 않음
        skipUndefinedProperties: false, // 정의되지 않은 속성을 건너뛰지 않음
        forbidUnknownValues: false, // 알 수 없는 속성이 있는 경우 예외 발생
        whitelist: false, // 허용되지 않은 속성이 있는 경우 제거
        forbidNonWhitelisted: false, // 허용되지 않은 속성이 있는 경우 예외 발생
      }),
    );

    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
    );
  }

  private swaggerAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.swaggerAuthInfo.user]: this.swaggerAuthInfo.password,
        },
      }),
    );
  }

  private swagger() {
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('NestJS API description')
      .setVersion('1.0')
      .addTag('nestjs')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(this.server, config);
    SwaggerModule.setup('docs', this.server, document);
  }

  async bootstrap() {
    this.policy();
    this.session();
    this.nestLib();
    this.swaggerAuth();
    this.swagger();
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
