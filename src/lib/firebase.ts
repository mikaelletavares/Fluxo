import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdtdaL2ktiXaHQO6yw-csM8ZkB06ziVaY",
  authDomain: "fluxo-pro-site.firebaseapp.com",
  projectId: "fluxo-pro-site",
  storageBucket: "fluxo-pro-site.firebasestorage.app",
  messagingSenderId: "937816373318",
  appId: "1:937816373318:web:66ccf18aa8a5fd0338f247",
  measurementId: "G-1PCRPPJ8LZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
