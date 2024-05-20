import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseAccountService } from './firebase/firebase.account.service';
import {
  FirebaseCreateAccountDto,
  FirebaseEmailDto,
  FirebaseUidDto,
} from './dto/firebase.dto';
import { FirebaeLoginService } from './firebase/firebae-login.service';

@ApiTags('login-firebase')
@Controller('login-firebase')
export class LoginFirebaseController {
  constructor(
    private readonly firebaseAccountService: FirebaseAccountService,
    private readonly firebaeLoginService: FirebaeLoginService,
  ) {}

  @Get('get-account/:uid')
  async getAccount(@Param() param: FirebaseUidDto) {
    const { uid } = param;
    const result = await this.firebaseAccountService.getAccount(uid);
    return result;
  }

  @Post('create-account')
  async createAccount(@Body() body: FirebaseCreateAccountDto) {
    const result = await this.firebaseAccountService.createAccount(body);
    return result;
  }

  @Post('update-account/:uid')
  async updateAccount(
    @Param() param: FirebaseUidDto,
    @Body() body: FirebaseCreateAccountDto,
  ) {
    const { uid } = param;
    const result = await this.firebaseAccountService.updateAccount(uid, body);
    return result;
  }

  @Delete('delete-account/:uid')
  async deleteAccount(@Param() param: FirebaseUidDto) {
    const { uid } = param;
    const result = await this.firebaseAccountService.deleteAccount(uid);
    return result;
  }

  @Get('change-password/:email')
  async changePassword(@Param() param: FirebaseEmailDto) {
    const { email } = param;
    const result = await this.firebaseAccountService.changePassword(email);
    return result;
  }

  @Get('verify-email/:email')
  async verifyEmail(@Param() param: FirebaseEmailDto) {
    const { email } = param;
    const result = await this.firebaseAccountService.verifyEmail(email);
    return result;
  }

  @Get('login/:uid')
  async login(@Param() param: FirebaseUidDto) {
    const { uid } = param;
    const result = await this.firebaeLoginService.createCustomToken(uid);
    return result;
  }
}
