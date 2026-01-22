
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeNXMvX2eMAAoIz4Gkk4hYkyHNKqJAGpE",
  authDomain: "etiquetas-modulos.firebaseapp.com",
  projectId: "etiquetas-modulos",
  storageBucket: "etiquetas-modulos.firebasestorage.app",
  messagingSenderId: "342555028363",
  appId: "1:342555028363:web:4498e953a2011a0841dd8e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
