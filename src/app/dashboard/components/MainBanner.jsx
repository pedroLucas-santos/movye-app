"use client"
import React, { useEffect, useState } from "react"
import NavBar from "./NavBar"
import { fetchMovieLastWatched, fetchUserLastMovieReview } from "../../lib/movieApi"
import { useAuth } from "@/app/context/auth-context"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"

const MainBanner = () => {
    const [lastWatchedMovie, setLastWatchedMovie] = useState({})
    const [lastWatchedMovieReview, setLastWatchedMovieReview] = useState({})
    const { user } = useAuth()
    const { updateSignal } = useMovieUpdate()

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
        const fetchLastMovie = async () => {
            try {
                const obj = await fetchMovieLastWatched()
                setLastWatchedMovie(obj) //
            } catch (e) {
                console.error(e)
            }
        }

        fetchLastMovie()
    }, [updateSignal])

    useEffect(() => {
        const fetchLastMovieReview = async () => {
            try {
                console.log(lastWatchedMovie)
                const obj = await fetchUserLastMovieReview(lastWatchedMovie.id)
                setLastWatchedMovieReview(obj) //
            } catch (e) {
                console.error(e)
            }
        }
        if (lastWatchedMovie && lastWatchedMovie.id) {
            fetchLastMovieReview()
        }
    }, [lastWatchedMovie])

    return (
        <div
            className={`relative w-full h-[720px] bg-cover shadow-inner shadow-gray-900/80`}
            style={{ backgroundImage: lastWatchedMovie.backdropUrl ? `url(${lastWatchedMovie.backdropUrl})` : "" }}
        >
            <div id="dark-filter" className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 flex flex-col items-center">
                <NavBar />
                <div className="w-full h-[500px] mt-8 flex justify-evenly items-center">
                    <div className="flex justify-center flex-col gap-2">
                        <span className="text-4xl font-bold antialiased">Último filme assistido:</span>
                        <span className="text-2xl antialiased w-3/4 text-center ml-4">{lastWatchedMovie.title}</span>

                        <div className="flex flex-col p-8 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark mt-2">
                            <div className="flex">
                                <div className="flex gap-4">
                                    {lastWatchedMovieReview?.user?.photoURL && (
                                        <img
                                            id="avatar"
                                            src={lastWatchedMovieReview.user.photoURL}
                                            className="rounded-full h-10 w-10 cursor-pointer"
                                            alt="Avatar"
                                        />
                                    )}
                                    <div className="flex flex-col">
                                        <div className="flex gap-3 items-center -mt-1">
                                            {lastWatchedMovieReview?.user?.displayName && (
                                                <p className="font-semibold cursor-pointer">{lastWatchedMovieReview.user.displayName}</p>
                                            )}
                                        </div>
                                        {lastWatchedMovieReview.rating && (
                                            <div className="text-[#005ef6] text-xl tracking-[2px] flex">
                                                {Array.from({ length: 5 }, (_, index) => renderStar(index + 1, lastWatchedMovieReview.rating))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="italic mt-4 text-[18px] text-white font-normal">{lastWatchedMovieReview.review}</div>
                            <div className="flex gap-6 text-white text-[12px] mt-4">
                                <span>{lastWatchedMovieReview.reviewed_at}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-[300px] h-[450px]">
                        <img src={lastWatchedMovie.posterUrl} alt="" className="w-full h-full select-none" />
                    </div>
                </div>
            </div>
            {console.log(lastWatchedMovieReview)}
        </div>
    )
}

export default MainBanner