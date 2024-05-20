import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FirebaseConfigProvier = {
  provide: 'FirebaseAdmin',
  useFactory: async (configService: ConfigService) => {
    const firebase = JSON.parse(configService.get('FIREBASE') || '{}');

    if (!firebase?.projectId) {
      return null;
    }

    admin.initializeApp({
      projectId: firebase.projectId,
      credential: admin.credential.cert({
        projectId: firebase.projectId,
        clientEmail: firebase.clientEmail,
        privateKey: Buffer.from(firebase.privateKey, 'base64').toString(),
      }),
    });
    return admin;
  },
  inject: [ConfigService],
};
