import { useRouter } from "next/navigation"
import React from "react"

const MustBeLogged = () => {
    const router = useRouter()
    
    return (
        <div className="flex justify-center items-center h-screen flex-col">
            <p className="text-xl font-semibold text-white">Você precisa estar logado para acessar o site!</p>
            <div className="flex justify-center items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon"
                    width="24"
                    height="24"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <path d="M10 16l4-4-4-4" />
                    <path d="M14 12H8" />
                </svg>
                <button
                    onClick={() => router.push("./login")}
                    className="text-xl font-semibold text-white bg-primary-dark hover:bg-primary-dark-hover rounded-md "
                >
                    Login
                </button>
            </div>
        </div>
    )
}

export default MustBeLogged
