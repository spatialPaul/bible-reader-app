import { auth, db } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Sign up function
async function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const displayName = document.getElementById('signup-name').value;
  
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      displayName: displayName,
      email: email,
      createdAt: new Date(),
      readingSettings: {
        notificationsEnabled: true,
        reminderTime: "08:00",
        darkMode: false,
        textSize: "medium"
      }
    });
    
    showScreen('home-screen');
  } catch (error) {
    alert(`Error creating account: ${error.message}`);
  }
}

// Login function
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    showScreen('home-screen');
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}

// Logout function
function logout() {
  signOut(auth).then(() => {
    showScreen('login-screen');
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, load their data
    loadUserData(user.uid);
    showScreen('home-screen');
  } else {
    // User is signed out, show login screen
    showScreen('login-screen');
  }
});
