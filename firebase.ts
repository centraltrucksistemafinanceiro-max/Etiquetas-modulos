import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const auth = getAuth(app);

// Habilita persistência offline para carregar o sistema instantaneamente em visitas repetidas
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Múltiplas abas abertas, persistência habilitada apenas na primeira.");
    } else if (err.code === 'unimplemented') {
      console.warn("O navegador não suporta persistência offline.");
    }
  });
}
