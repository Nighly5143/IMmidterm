// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7HX1lENbJy3t3wxUMoCVEOrfdIPgqtA8",
  authDomain: "incomeexpensetracker-4b2e0.firebaseapp.com",
  projectId: "incomeexpensetracker-4b2e0",
  storageBucket: "incomeexpensetracker-4b2e0.appspot.com",
  messagingSenderId: "918292160741",
  appId: "1:918292160741:web:5e872b1df4f98b500cf40c"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export default db;