// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiOqI2iSVP54DXTF01alAElrYkFV4BvNc",
  authDomain: "mecoo-712c0.firebaseapp.com",
  projectId: "mecoo-712c0",
  storageBucket: "mecoo-712c0.appspot.com",
  messagingSenderId: "362260396657",
  appId: "1:362260396657:web:691338d441ee25c47b79d0",
  measurementId: "G-2J7GWT6K6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;