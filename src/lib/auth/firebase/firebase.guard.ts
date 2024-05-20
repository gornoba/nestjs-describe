import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(@Inject('FirebaseAdmin') private firebase: admin.app.App) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    const token = auth.split(/\s/)[1];

    try {
      const decodedToken: DecodedIdToken = await this.firebase
        .auth()
        .verifyIdToken(token);

      const user: UserRecord = await this.firebase
        .auth()
        .getUser(decodedToken.uid);
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
