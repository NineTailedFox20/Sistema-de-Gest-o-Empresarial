
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
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

// Initialize Firestore with offline persistence
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

const auth = getAuth(app);

export { db, auth };
