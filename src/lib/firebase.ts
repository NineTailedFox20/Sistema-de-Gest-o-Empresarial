
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    console.warn('Firestore persistence failed: multiple tabs open.');
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    console.warn('Firestore persistence is not available in this browser.');
  }
});

export { db, auth };
