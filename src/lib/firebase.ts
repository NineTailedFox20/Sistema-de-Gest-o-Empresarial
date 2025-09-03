
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'foxdash',
  appId: '1:509198466518:web:086465ee00efdee8a9b877',
  storageBucket: 'foxdash.firebasestorage.app',
  apiKey: 'AIzaSyDnudX00uFmdickFnqu1KUXjun2alDfhG4',
  authDomain: 'foxdash.firebaseapp.com',
  messagingSenderId: '509198466518',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
