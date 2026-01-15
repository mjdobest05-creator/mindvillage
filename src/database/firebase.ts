import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: 'mindvillage-app.firebaseapp.com',
    projectId: 'mindvillage-app',
    storageBucket: 'mindvillage-app.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123def456',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
