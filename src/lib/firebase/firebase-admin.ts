import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Check if we have the required environment variables
const requiredEnvVars = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
};

// Log which environment variables are missing
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
  }
});

if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const config = {
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    };

    console.log('Initializing Firebase Admin with config:', {
      ...config,
      credential: 'CREDENTIALS_HIDDEN',
    });

    admin.initializeApp(config);
    console.log('Firebase Admin initialized successfully');
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore(); 