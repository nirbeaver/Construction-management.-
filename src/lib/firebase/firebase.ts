import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADvG6THoYN_RJDlCnV3o0pb71YKWeR5R4",
  authDomain: "construction-management-c9150.firebaseapp.com",
  projectId: "construction-management-c9150",
  storageBucket: "construction-management-c9150.firebasestorage.app",
  messagingSenderId: "212193368586",
  appId: "1:212193368586:web:f4a6461762fab93725ddf3",
  measurementId: "G-CQXEL8ZEBS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; 