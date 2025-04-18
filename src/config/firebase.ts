import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDpxjoa-a5DDM0tg2Vq_E-1SKFnGKawMbM",
  authDomain: "raja-dhaba-bc244.firebaseapp.com",
  projectId: "raja-dhaba-bc244",
  storageBucket: "raja-dhaba-bc244.firebasestorage.app",
  messagingSenderId: "185577352532",
  appId: "1:185577352532:web:37c7b82314df98d43e6cc1"
};

// Initialize Firebase only if it hasn't been initialized already
let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
let firestore = getFirestore(firebaseApp);
let auth = getAuth(firebaseApp);

export { firebaseApp, firestore, auth }; 