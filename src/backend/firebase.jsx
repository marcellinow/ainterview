// src/backend/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcw-623OQxE_22YdXwLxExuQLrEDcQkVI",
  authDomain: "ainterview-cd492.firebaseapp.com",
  projectId: "ainterview-cd492",
  storageBucket: "ainterview-cd492.firebasestorage.app",
  messagingSenderId: "81078585920",
  appId: "1:81078585920:web:cddc6cb52ee78361a72da5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
