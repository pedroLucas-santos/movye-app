"use client"
import { useEffect, useState, useRef } from "react"
import { fetchMovieLastWatched, fetchUserLastMovieReview } from "../../lib/movieApi"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"
import NavBar from "../../NavBar"

const MainBanner = () => {
    const [lastWatchedMovie, setLastWatchedMovie] = useState({})
    const [allReviews, setAllReviews] = useState([])
    const [currentReview, setCurrentReview] = useState(null)
    const [reviewIndex, setReviewIndex] = useState(0)
    const reviewChangeInterval = 5000
    const [animate, setAnimate] = useState(false) // Estado de animação
    const { updateSignal } = useMovieUpdate()
    const allReviewsRef = useRef(allReviews)

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
                const reviews = await fetchUserLastMovieReview(lastWatchedMovie.id)
                setAllReviews(reviews) //
                if (reviews && reviews.length > 0) {
                    setCurrentReview(reviews[0]) // Exibe a primeira review ao iniciar
                }else {
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
                        <span className="text-4xl font-bold antialiased">Último filme assistido:</span>
                        <span className="text-2xl antialiased w-3/4 text-center ml-4">{lastWatchedMovie.title}</span>

                        {currentReview && (
                            <div className='flex flex-col p-8 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark mt-2'>
                                <div className="flex">
                                    <div className={`flex gap-4 ${animate ? 'animate-fadeIn' : ""}`}>
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
                                                    <p className="font-semibold cursor-pointer">{currentReview.user.displayName}</p>
                                                )}
                                            </div>
                                            {currentReview.rating && (
                                                <div className="text-[#005ef6] text-xl tracking-[2px] flex">
                                                    {Array.from({ length: 5 }, (_, index) => renderStar(index + 1, currentReview.rating))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`italic mt-4 text-[18px] text-white font-normal ${animate ? 'animate-fadeIn' : ""}`}>{currentReview.review}</div>
                                <div className={`flex gap-6 text-white text-[12px] mt-4 ${animate ? 'animate-fadeIn' : ""}`}>
                                    <span>{currentReview.reviewed_at}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-[300px] h-[450px]">
                        <img src={lastWatchedMovie.posterUrl} alt="" className="w-full h-full select-none shadow-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainBanner
