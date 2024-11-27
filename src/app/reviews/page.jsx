"use client"
import { useAuth } from "../context/auth-context"
import "../Header.css"
import LoadingSpinner from "../LoadingSpinner"
import NavBar from "../NavBar"
import MustBeLogged from "../MustBeLogged"
import { useState, useEffect } from "react"
import { fetchLastReviewUser } from "../lib/movieApi" // Importando a função
import Image from "next/image"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"

const Reviews = () => {
    const { user, loading } = useAuth()
    const { updateSignal } = useMovieUpdate()
    const [lastReview, setLastReview] = useState({})

    const renderStar = (index, movieRating) => {
        const isFilled = index <= movieRating
        return (
            <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill={isFilled ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-5 h-5 transition-colors ${isFilled ? "text-white" : "text-white/20"}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 17.75l-5.8 3.04 1.1-6.44-4.7-4.58 6.5-.58L12 2l2.9 6.28 6.5.58-4.7 4.58 1.1 6.44L12 17.75z"
                />
            </svg>
        )
    }

    useEffect(() => {
        if (!user?.uid) return // Verifica se o user está disponível

        const fetchLastMovieReview = async () => {
            try {
                const response = await fetchLastReviewUser(user.uid) // Chama a função para pegar a última review
                setLastReview(response) // Atualiza o estado com a resposta
            } catch (e) {
                console.error(e)
            }
        }

        fetchLastMovieReview() // Chama a função
    }, [updateSignal]) // A dependência é o `user?.uid`, para que a função seja chamada toda vez que o user mudar

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <MustBeLogged />
    }

    return (
        <main id="view" className="w-full h-full scroll-smooth overflow-y-auto">
            <NavBar />
            <div className="border-2 border-dashed border-red-600 p-4">
                <div id="userInfo" className="flex border-2 border-cyan-100 flex-col w-96 justify-center items-center gap-4 p-4">
                    <Image
                        className="rounded-full"
                        src={`${user.photoURL.replace("s96-c", "s400-c")}`}
                        alt="User's profile picture"
                        width={256}
                        height={256}
                        quality={100}
                    />
                    <div className="flex flex-col">
                        <div className="items-center flex flex-col">
                            <span className="text-lg font-semibold">{user.displayName}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                            <div className="mt-4 flex flex-col justify-center items-center gap-4">
                                <span>Reviews: 8</span>
                                <div>
                                    <span className="flex flex-col justify-center items-center">
                                        Média de avaliação{" "}
                                        <span className="flex">
                                            {Array.from({ length: 5 }, (_, index) => renderStar(index + 1, lastReview.rating))}
                                        </span>
                                    </span>
                                </div>
                                <div>
                                    <span className="flex flex-col justify-center items-center">
                                        Generos mais assistidos:
                                        <span className="text-sm bg-indigo-700 p-1">Drama</span>
                                    </span>
                                </div>
                                <span>Última review:</span>
                                <div className="flex flex-col items-center p-8 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark">
                                    <div className="flex just">
                                        <div className={`flex gap-4`}>
                                            <div className="flex flex-col">
                                                <div className="flex items-center">
                                                    {lastReview?.id && <p className="font-semibold cursor-pointer text-center">{lastReview.id}</p>}
                                                </div>
                                                {lastReview.rating && (
                                                    <div className="text-[#005ef6] text-xl tracking-[2px] flex justify-center mt-4">
                                                        {Array.from({ length: 5 }, (_, index) => renderStar(index + 1, lastReview.rating))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`italic mt-4 text-[18px] text-white font-normal`}>{lastReview.review}</div>
                                    <div className={`flex gap-1 text-white text-[12px] mt-4 flex-col`}>
                                        <span>{lastReview.reviewed_at}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Reviews
