import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LibModule } from 'src/lib/lib.module';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [LibModule, DbModule, HttpModule],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
