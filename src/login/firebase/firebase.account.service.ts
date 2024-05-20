import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseCreateAccountDto } from '../dto/firebase.dto';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class FirebaseAccountService {
  constructor(@Inject('FirebaseAdmin') private firebase: admin.app.App) {}

  async getAccount(uid: string): Promise<UserRecord> {
    const user = await this.firebase.auth().getUser(uid);
    return user;
  }

  async createAccount(body: FirebaseCreateAccountDto): Promise<UserRecord> {
    const { phoneNumber, displayName } = body;

    const user = await this.firebase.auth().createUser({
      phoneNumber,
      displayName,
      disabled: false,
    });

    await this.firebase.auth().setCustomUserClaims(user.uid, {
      role: 'user',
      mbti: 'INTJ',
      purpose: 'study',
    });

    return user;
  }

  async updateAccount(
    uid: string,
    body: FirebaseCreateAccountDto,
  ): Promise<UserRecord> {
    const { phoneNumber, displayName, disabled } = body;

    const user = await this.getAccount(uid);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.firebase.auth().updateUser(uid, {
      phoneNumber,
      displayName,
      disabled: disabled || false,
    });

    await this.firebase.auth().setCustomUserClaims(user.uid, {
      ...user.customClaims,
      role: 'user2',
      purpose: 'study',
    });

    const updateUser = await this.getAccount(uid);

    return updateUser;
  }

  async deleteAccount(uid: string) {
    const user = await this.firebase.auth().deleteUser(uid);
    return user;
  }

  async changePassword(email: string) {
    const result = await this.firebase.auth().generatePasswordResetLink(email, {
      url: 'http://localhost:3000', // redirect url
      handleCodeInApp: true,
    });

    return result.replace('lang=en', 'lang=ko');
  }

  async verifyEmail(email: string) {
    const result = await this.firebase
      .auth()
      .generateEmailVerificationLink(email, {
        url: 'http://localhost:3000', // redirect url
        handleCodeInApp: true,
      });

    return result.replace('lang=en', 'lang=ko');
  }
}
