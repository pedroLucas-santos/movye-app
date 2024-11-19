"use client"

import { signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth, googleProdiver, db } from "@/app/lib/firebase-config"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [rememberMe, setRememberMe] = useState(false)

    // Função de login
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProdiver)
            const { user } = result
            const { uid, displayName, email, photoURL } = user

            const userDocRef = doc(db, "users", uid)

            const userDoc = await getDoc(userDocRef)

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    displayName: displayName || "Anonymous",
                    email: email,
                    photoURL: photoURL || "",
                    createdAt: new Date().toISOString(),
                })
            }

            const token = await user.getIdToken()
            if (rememberMe) {
                document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
            } else {
                sessionStorage.setItem("authToken", token)
            }

            router.push("/dashboard")
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token =
                document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("authToken="))
                    ?.split("=")[1] || sessionStorage.getItem("authToken")

            if (token) {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        router.push("/dashboard")
                    }
                })
            }
        }

        checkAuth()
    }, [router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark text-white">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-12">Movye</h1>

            <div className="mb-6">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 accent-purple-500 transition-transform duration-300 ease-in-out transform 
                       checked:scale-125 checked:opacity-100 opacity-75"
                    />
                    <span className="text-sm">Continuar conectado</span>
                </label>
            </div>

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
