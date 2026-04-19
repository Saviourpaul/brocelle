
import { auth, googleProvider } from "./firebase-config.js";
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

const loginBtn = document.getElementById("submitLogin");
if (loginBtn) {
    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = document.getElementById('Email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            ShowMessage('Please fill in both email and password', 'LoginMessage', true);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            ShowMessage('Login Successful', 'LoginMessage');
            setTimeout(() => { window.location.href = '../Admin/Dashboard.html'; }, 1000);
        } catch (error) {
            console.error("Login Error:", error);
            let errorMessage = 'Invalid credentials';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid Email or Password';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials';
            }
            ShowMessage(errorMessage, 'LoginMessage', true);
        }
    });
}

const googleSignInBtn = document.getElementById("googleSignIn");
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            ShowMessage('Google Sign In Successful', 'LoginMessage');
            setTimeout(() => { window.location.href = '../Admin/Dashboard.html'; }, 1000);
        } catch (error) {
            console.error("Google Login Error:", error);
            ShowMessage('Google Sign In failed: ' + error.message, 'LoginMessage', true);
        }
    });
}
