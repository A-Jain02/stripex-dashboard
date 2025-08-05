// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1uu-3zM-iM3j6h5ZRIFzlRNQcb-Q8Szc",
  authDomain: "stripex-demo.firebaseapp.com",
  projectId: "stripex-demo",
  storageBucket: "stripex-demo.firebasestorage.app",
  messagingSenderId: "216424597288",
  appId: "1:216424597288:web:8c2168c9186ab62f88f21d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
