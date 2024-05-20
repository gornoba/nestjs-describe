import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaeLoginService {
  constructor(@Inject('FirebaseAdmin') private firebase: admin.app.App) {}

  async createCustomToken(uid: string): Promise<string> {
    const customToken = await this.firebase.auth().createCustomToken(uid);
    return customToken;
  }
}
