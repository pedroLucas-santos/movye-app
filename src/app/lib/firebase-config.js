// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWrQOga8HwiCVZJ7Dy1qx5pAj-0pf4rE8",
    authDomain: "movye-2c5ea.firebaseapp.com",
    projectId: "movye-2c5ea",
    storageBucket: "movye-2c5ea.firebasestorage.app",
    messagingSenderId: "510222843177",
    appId: "1:510222843177:web:aaa759b70ae22573db0b38",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProdiver = new GoogleAuthProvider()
