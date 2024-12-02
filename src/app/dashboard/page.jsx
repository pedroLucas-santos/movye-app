"use client"
import "../Header.css"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/auth-context"
import MainBanner from "./components/MainBanner"
import MoviesWatched from "./components/MoviesWatched"
import LoadingSpinner from "../shared/LoadingSpinner"
import MustBeLogged from "../shared/MustBeLogged"

export default function Dashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()

    if (loading) {
        return <LoadingSpinner /> // Pode ser uma tela de carregamento enquanto o usuário é carregado
    }

    if (!user) {
        return <MustBeLogged />
    }

    return (
        <main id="view" className="w-full h-full scroll-smooth overflow-y-auto">
            <MainBanner />
            <MoviesWatched />
        </main>
    )
}
