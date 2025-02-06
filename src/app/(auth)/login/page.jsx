"use client"

import { signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth, googleProdiver, db } from "@/app/lib/firebase-config"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { isFriendCodeUnique } from "@/app/lib/movieApi"
import Image from "next/image"

export default function LoginPage() {
    const router = useRouter()
    const [rememberMe, setRememberMe] = useState(false)

    function generateFriendCode() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        const codeLength = 8 // Tamanho do código
        let code = ""

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            code += characters[randomIndex]
        }

        return code
    }

    const generateUniqueFriendCode = async () => {
        let code
        let isUnique = false

        while (!isUnique) {
            code = generateFriendCode()
            isUnique = await isFriendCodeUnique(code)
        }

        return code
    }

    // Função de login
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProdiver)
            const { user } = result
            const { uid, displayName, email, photoURL } = user
            const friendCode = await generateUniqueFriendCode()

            const userDocRef = doc(db, "users", uid)

            const userDoc = await getDoc(userDocRef)

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    bio: null,
                    displayName: displayName || "Anonymous",
                    email: email,
                    photoURL: photoURL || null,
                    createdAt: new Date().toISOString(),
                    friendCode: friendCode,
                    favoriteMovie: {
                        backdropPath: null,
                        id: null,
                        title: null,
                    },
                })
            } else {
                //nao foi testado
                if (userDoc.data().photoURL !== photoURL) {
                    await updateDoc(userDocRef, {
                        photoURL: photoURL
                    })
                }
            }

            const token = await user.getIdToken()
            if (rememberMe) {
                document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
            } else {
                sessionStorage.setItem("authToken", token)
            }

            router.push(`/groups/${user.uid}`) //alterar para dashboard depois, ou nao nao sei
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
                        router.push(`/groups/${user.uid}`)
                    }
                })
            }
        }

        checkAuth()
    }, [router])

    useEffect(() => {
        localStorage.removeItem('selectedGroup')
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-dark text-white">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-800 mb-12">Movye</h1>

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
                <Image
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google Icon"
                    className="w-5 h-5"
                    width={1920}
                    height={1080}
                    quality={100}
                />
                <span className="font-medium">Login com Google</span>
            </button>
        </div>
    )
}
