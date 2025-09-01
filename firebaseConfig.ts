import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCdtdaL2ktiXaHQO6yw-csM8ZkB06ziVaY",
  authDomain: "fluxo-pro-site.firebaseapp.com",
  projectId: "fluxo-pro-site",
  storageBucket: "fluxo-pro-site.firebasestorage.app",
  messagingSenderId: "937816373318",
  appId: "1:937816373318:web:66ccf18aa8a5fd0338f247",
  measurementId: "G-1PCRPPJ8LZ"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export { app, analytics };
