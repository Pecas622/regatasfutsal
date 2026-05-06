// 🔥 CONFIG FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBoGkV8H7wQbmCODjE-FjooFyHSd5DF2Xw",
    authDomain: "voz-arg-2c418.firebaseapp.com",
    projectId: "voz-arg-2c418",
    storageBucket: "voz-arg-2c418.firebasestorage.app",
    messagingSenderId: "183648059891",
    appId: "1:183648059891:web:09bf47bab7a58896ba1286",
    measurementId: "G-9DMPEHV3TC"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);