import { Module, forwardRef } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LibModule } from 'src/lib/lib.module';

@Module({
  imports: [forwardRef(() => LibModule)],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
