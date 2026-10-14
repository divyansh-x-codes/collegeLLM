import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// Web app Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyBrC-4EsLWWsB_9tQXMnbuWBAwL3ygiPzQ",
  authDomain: "college-system-6fb56.firebaseapp.com",
  projectId: "college-system-6fb56",
  storageBucket: "college-system-6fb56.firebasestorage.app",
  messagingSenderId: "1093511979336",
  appId: "1:1093511979336:web:a72a37d27358db0856537d",
  measurementId: "G-B90ZPYEJ41"
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Force account selection prompt on login
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged 
};

export default app;
