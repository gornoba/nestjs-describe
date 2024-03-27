import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LibModule } from './lib/lib.module';

@Module({
  imports: [CatsModule, LibModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
