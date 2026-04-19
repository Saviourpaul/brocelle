
import { auth } from "./firebase-config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

function ShowMessage(message, divId, isError = false) {
    const messageDiv = document.getElementById(divId);
    if (!messageDiv) return;
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.className = isError ? "alert alert-danger" : "alert alert-success";
    messageDiv.style.opacity = 1;
    
    // Smooth transition
    messageDiv.style.transition = "opacity 0.5s ease";
}

const resetForm = document.getElementById("resetForm");
if (resetForm) {
    resetForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('Email').value.trim();
        const submitBtn = document.getElementById('submitReset');

        if (!email) {
            ShowMessage('Please enter your email address.', 'ResetMessage', true);
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            
            await sendPasswordResetEmail(auth, email);
            
            ShowMessage('Password reset email sent! Please check your inbox and follow the instructions.', 'ResetMessage');
            resetForm.reset();
        } catch (error) {
            console.error("Reset Error:", error);
            let errorMessage = 'Failed to send reset email.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else {
                errorMessage = error.message;
            }
            ShowMessage(errorMessage, 'ResetMessage', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Reset Link';
        }
    });
}
