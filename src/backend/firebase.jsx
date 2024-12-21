// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEDTHpUjjqHrYeJDfCYQZi-QiRSUUUpVo",
  authDomain: "ai-nterview-e36b5.firebaseapp.com",
  projectId: "ai-nterview-e36b5",
  storageBucket: "ai-nterview-e36b5.firebasestorage.app",
  messagingSenderId: "480747008780",
  appId: "1:480747008780:web:e0557001021301b8208f29",
  measurementId: "G-5YL14P547Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };
