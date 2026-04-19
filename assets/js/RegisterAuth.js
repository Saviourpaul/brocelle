
import { auth, db, googleProvider } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function ShowMessage(message, divId, isError = false) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.className = isError ? "alert alert-danger" : "alert alert-success";
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        setTimeout(() => { messageDiv.style.display = "none"; }, 500);
    }, 5000);
}

const saveUserToFirestore = async (user, additionalData = {}) => {
    const docRef = doc(db, "users", user.uid);
    const userData = {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        ...additionalData
    };
    await setDoc(docRef, userData, { merge: true });
};

const signUpBtn = document.getElementById("submitRegister");
if (signUpBtn) {
    signUpBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = document.getElementById('Email').value.trim();
        const password = document.getElementById('password').value;
        const FirstName = document.getElementById('FirstName').value.trim();
        const LastName = document.getElementById('LastName').value.trim();

        if (!email || !password || !FirstName || !LastName) {
            ShowMessage('Please fill in all fields', 'RegisterMessage', true);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await saveUserToFirestore(userCredential.user, { FirstName, LastName });
            ShowMessage('Account Created Successfully', 'RegisterMessage');
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        } catch (error) {
            console.error("Error during sign up:", error);
            let errorMessage = 'Unable to create user';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already exists!';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak (min 6 characters)';
            }
            ShowMessage(errorMessage, 'RegisterMessage', true);
        }
    });
}

const googleSignUpBtn = document.getElementById("googleSignUp");
if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const names = user.displayName ? user.displayName.split(' ') : ['Google', 'User'];
            await saveUserToFirestore(user, {
                FirstName: names[0],
                LastName: names.slice(1).join(' ') || '',
                photoURL: user.photoURL
            });
            ShowMessage('Google Registration Successful', 'RegisterMessage');
            setTimeout(() => { window.location.href = '../Admin/Dashboard.html'; }, 1000);
        } catch (error) {
            console.error("Google Auth Error:", error);
            ShowMessage('Google Sign Up failed: ' + error.message, 'RegisterMessage', true);
        }
    });
}
