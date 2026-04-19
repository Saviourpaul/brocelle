
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOfGUb6OPAtodz3rIKh15pmH1Fz7iMXU0",
    authDomain: "auth-c9646.firebaseapp.com",
    projectId: "auth-c9646",
    storageBucket: "auth-c9646.firebasestorage.app",
    messagingSenderId: "700253741251",
    appId: "1:700253741251:web:8fdf09f26e09da2e3a0276"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };
