import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmPR5vQ2XqkC8JflLGaUSHG4VfcwZmFvI",
  authDomain: "dor-vocab-app.firebaseapp.com",
  projectId: "dor-vocab-app",
  storageBucket: "dor-vocab-app.appspot.com",
  messagingSenderId: "135982972975",
  appId: "1:135982972975:web:829e24cf8de3a50d0086da"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// נתיבי ההפניה - קיימים במקום אחד כדי שכל הדפים יסכימו ביניהם
export const REDIRECTS = {
  admin: './admin-dashboard.html',
  teacher: './teacher-dashboard.html',
  student: './vocab_app.html',
  login: './index.html'
};
