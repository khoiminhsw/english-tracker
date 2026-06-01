// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Xóa đoạn config mẫu này và dán config thật của bạn từ Bước 1 vào đây
const firebaseConfig = {
  apiKey: "AIzaSyAyPjBYYlQShuJ6BIOkDTxc1rpdg_Mqi0s",
  authDomain: "english-tracker-84a01.firebaseapp.com",
  projectId: "english-tracker-84a01",
  storageBucket: "english-tracker-84a01.firebasestorage.app",
  messagingSenderId: "630152870960",
  appId: "1:630152870960:web:9277b55b9fff0707ad81f5"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các công cụ để dùng ở App.jsx
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);