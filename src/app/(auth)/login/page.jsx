// app/login/page.js
"use client"

import { signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth, googleProdiver, db } from "@/app/lib/firebase-config"
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage() {
    const router = useRouter()

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProdiver)
            const { user } = result
            const { uid, displayName, email, photoURL } = user

            // Referência ao documento do usuário no Firestore
            const userDocRef = doc(db, "users", uid)

            // Verifica se o documento já existe
            const userDoc = await getDoc(userDocRef)

            if (!userDoc.exists()) {
                // Se o usuário não existir, cria um novo documento
                await setDoc(userDocRef, {
                    displayName: displayName || "Anonymous",
                    email: email,
                    photoURL: photoURL || "",
                    createdAt: new Date().toISOString(),
                })
            }
            router.push("/dashboard")
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark text-white">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-12">Movye</h1>

            <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-lg shadow-md 
                           hover:bg-gray-100 hover:shadow-lg transition duration-200 ease-in-out"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" className="w-5 h-5" />
                <span className="font-medium">Login with Google</span>
            </button>
        </div>
    )
}
