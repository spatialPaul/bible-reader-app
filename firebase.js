npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7Si7lQ2EqUOf2QDjggNjxffSZLipBuZo",
  authDomain: "bible-reader-web-app.firebaseapp.com",
  projectId: "bible-reader-web-app",
  storageBucket: "bible-reader-web-app.firebasestorage.app",
  messagingSenderId: "551225720613",
  appId: "1:551225720613:web:9b15a171360b014b6f64cc",
  measurementId: "G-0FVGQHDTFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
