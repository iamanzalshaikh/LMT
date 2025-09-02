// src/firebase.js

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "login-a78f0.firebaseapp.com",
  projectId: "login-a78f0",
  storageBucket: "login-a78f0.firebasestorage.app",
  messagingSenderId: "420098758259",
  appId: "1:420098758259:web:6fa88c1b82bdb3e7777c06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export auth and provider to use in your components
export { auth, provider };
export default app;
