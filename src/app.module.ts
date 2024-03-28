import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LibModule } from './lib/lib.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [CatsModule, LibModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
