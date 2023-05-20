// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjFwKUkXjZOqF1_EGafJ7ViJKirhrzKok",
  authDomain: "projetoweb-myhealth.firebaseapp.com",
  projectId: "projetoweb-myhealth",
  storageBucket: "projetoweb-myhealth.appspot.com",
  messagingSenderId: "531011255325",
  appId: "1:531011255325:web:c5655c40b91eb4c32e1af4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

setPersistence(auth, browserSessionPersistence)
const db = initializeFirestore(app, { experimentalForceLongPolling: true })

const storage = getStorage(app)

export {  auth, db, storage }
