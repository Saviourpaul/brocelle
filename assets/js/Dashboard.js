
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const loggedInUserId = user.uid;
        localStorage.setItem('loggedInUserId', loggedInUserId);
        
        try {
            const docRef = doc(db, "users", loggedInUserId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const fNameElements = document.querySelectorAll('#loggedUserFName');
                const lNameElements = document.querySelectorAll('#loggedUserLName');
                const emailElements = document.querySelectorAll('#loggedUserEmail');
                
                fNameElements.forEach(el => el.innerText = userData.FirstName || '');
                lNameElements.forEach(el => el.innerText = userData.LastName || '');
                emailElements.forEach(el => el.innerText = userData.email || '');
            } else {
                console.log("No user profile found in Firestore.");
                // Fallback to Firebase Auth display name if available
                if (user.displayName) {
                    const names = user.displayName.split(' ');
                    document.querySelectorAll('#loggedUserFName').forEach(el => el.innerText = names[0]);
                    document.querySelectorAll('#loggedUserLName').forEach(el => el.innerText = names.slice(1).join(' '));
                }
                document.querySelectorAll('#loggedUserEmail').forEach(el => el.innerText = user.email);
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    } else {
        console.log("No user is signed in. Redirecting...");
        window.location.href = '../Auth/login.html';
    }
});

const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem('loggedInUserId');
            await signOut(auth);
            window.location.href = '../Auth/login.html';
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });
}
