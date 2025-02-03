"use client"
import { useEffect, useState, useRef } from "react"
import { fetchMovieLastWatched, fetchUserLastMovieReview } from "@/app/lib/movieApi"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"
import NavBar from "@/app/shared/NavBar"
import RenderStars from "@/app/shared/RenderStars"
import { useGroup } from "@/app/context/groupProvider"
import Image from "next/image"

const MainBanner = () => {
    const [lastWatchedMovie, setLastWatchedMovie] = useState({})
    const [allReviews, setAllReviews] = useState([])
    const [currentReview, setCurrentReview] = useState(null)
    const [reviewIndex, setReviewIndex] = useState(0)
    const reviewChangeInterval = 5000
    const [animate, setAnimate] = useState(false) // Estado de animação
    const { updateSignal } = useMovieUpdate()
    const allReviewsRef = useRef(allReviews)
    const { selectedGroup } = useGroup()

    useEffect(() => {
        const fetchLastMovie = async () => {
            try {
                const obj = await fetchMovieLastWatched(selectedGroup.id)
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
                const reviews = await fetchUserLastMovieReview(lastWatchedMovie.id, selectedGroup.id)
                setAllReviews(reviews) //
                if (reviews && reviews.length > 0) {
                    setCurrentReview(reviews[0]) // Exibe a primeira review ao iniciar
                } else {
                    setCurrentReview(null)
                }
            } catch (e) {
                console.error(e)
            }
        }
        if (lastWatchedMovie && lastWatchedMovie.id) {
            fetchLastMovieReview()
        }
    }, [lastWatchedMovie])

    useEffect(() => {
        allReviewsRef.current = allReviews
    }, [allReviews])

    useEffect(() => {
        if (allReviewsRef.current.length > 1) {
            const interval = setInterval(() => {
                setReviewIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % allReviewsRef.current.length
                    setCurrentReview(allReviewsRef.current[nextIndex])
                    return nextIndex
                })
                setAnimate(true)
            }, reviewChangeInterval)

            return () => clearInterval(interval)
        }
    }, [allReviews, reviewChangeInterval])

    useEffect(() => {
        if (animate) {
            const timeout = setTimeout(() => {
                setAnimate(false)
            }, 1000)

            return () => clearTimeout(timeout)
        }
    }, [animate])

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
                        <span className="text-4xl font-bold antialiased text-white">Último filme assistido:</span>
                        <span className="text-2xl antialiased w-3/4 text-center ml-4 text-white">{lastWatchedMovie.title}</span>

                        {currentReview && (
                            <div className="hidden flex-col p-8 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark mt-2 md:flex">
                                <div className="flex">
                                    <div className={`flex gap-4 ${animate ? "animate-fadeIn" : ""}`}>
                                        {currentReview.user?.photoURL && (
                                            <img
                                                id="avatar"
                                                src={currentReview.user.photoURL}
                                                className="rounded-full h-10 w-10 cursor-pointer"
                                                alt="Avatar"
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <div className="flex gap-3 items-center -mt-1">
                                                {currentReview.user?.displayName && (
                                                    <p className="font-semibold cursor-pointer text-white">{currentReview.user.displayName}</p>
                                                )}
                                            </div>
                                            {currentReview.rating && (
                                                <div className="text-[#005ef6] text-xl tracking-[2px] flex">
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <RenderStars key={index} index={index + 1} movieRating={currentReview.rating} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`italic mt-4 text-[18px] text-white font-normal break-words w-[500px] ${animate ? "animate-fadeIn" : ""}`}>
                                    {currentReview.review}
                                </div>
                                <div className={`flex flex-col text-white text-[12px] mt-4 ${animate ? "animate-fadeIn" : ""}`}>
                                    <span>{currentReview.reviewed_at}</span>
                                    <span className="text-xs text-gray-400">{`Assistido com o grupo: ${currentReview.groupName}`}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-[300px] h-[450px]">
                        {lastWatchedMovie.posterUrl && (
                            <img src={lastWatchedMovie.posterUrl} alt="" className="w-full h-full select-none shadow-xl" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainBanner
