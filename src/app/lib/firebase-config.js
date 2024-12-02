import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { firebaseConfigDev, firebaseConfigProd } from "./firebaseConfig"

const firebaseConfig = process.env.NODE_ENV === 'production' ? firebaseConfigProd : firebaseConfigDev

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProdiver = new GoogleAuthProvider()
