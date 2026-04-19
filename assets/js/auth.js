
import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function initAuthListener() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
}

export async function checkAuthAndRedirect(targetPath = '../Auth/login.html') {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = targetPath;
            } else {
                resolve(user);
            }
        });
    });
}

export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = '../Auth/login.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
}
