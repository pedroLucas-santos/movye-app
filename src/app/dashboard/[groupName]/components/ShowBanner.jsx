'use client'
import { useEffect, useState, useRef } from 'react'
import { fetchMovieLastWatched, fetchUserLastMovieReview } from '@/app/lib/movieApi'
import { useMovieUpdate } from '@/app/context/movieUpdateProvider'
import NavBar from '@/app/shared/NavBar'
import RenderStars from '@/app/shared/RenderStars'
import { useGroup } from '@/app/context/groupProvider'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useContentType } from '@/app/context/contentTypeProvider'
import { fetchShowLastWatched } from '@/app/lib/showApi'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import { Skeleton } from '@heroui/skeleton'

const ShowBanner = () => {
    const [lastWatchedShow, setLastWatchedShow] = useState({})
    const [allReviews, setAllReviews] = useState([])
    const [currentReview, setCurrentReview] = useState(null)
    const [reviewIndex, setReviewIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const reviewChangeInterval = 5000
    const [animate, setAnimate] = useState(false) // Estado de animação
    const { updateSignal } = useMovieUpdate()
    const allReviewsRef = useRef(allReviews)
    const { selectedGroup } = useGroup()
    const { contentType, setContentType } = useContentType()
    const router = useRouter()

    useEffect(() => {
        const fetchLastShow = async () => {
            try {
                const obj = await fetchShowLastWatched(selectedGroup.id)
                setLastWatchedShow(obj) //
            } catch (e) {
                console.error(e)
            }
        }

        fetchLastShow()
    }, [updateSignal])

    useEffect(() => {
        const fetchLastShowReview = async () => {
            try {
                const reviews = await fetchUserLastMovieReview(selectedGroup.id, lastWatchedShow.id)
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
        if (lastWatchedShow && lastWatchedShow.id) {
            fetchLastShowReview()
        }
    }, [lastWatchedShow])

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
        <div className="relative w-full h-[720px] shadow-inner shadow-gray-900/80">
            {/* Skeleton enquanto a imagem carrega */}
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full bg-gray-800" />}

            {/* Background com Next Image */}
            {lastWatchedShow.backdropUrl && (
                <Image
                    src={lastWatchedShow.backdropUrl}
                    alt="Último assistido"
                    fill
                    quality={100}
                    className={`object-cover object-center transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoadingComplete={() => setIsLoading(false)}
                />
            )}

            {/* Overlay escuro */}
            <div id="dark-filter" className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 flex flex-col items-center">
                <NavBar />
                <div className="w-full h-[500px] mt-8 flex justify-evenly items-center p-4 md:p-0">
                    <div className="flex justify-center flex-col gap-2">
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-3xl md:text-4xl font-bold antialiased text-white">
                                {contentType === 'movie' ? 'Último filme assistido:' : 'Última série assistida:'}
                            </span>
                            <span className="text-lg md:text-2xl antialiased w-3/4 text-center ml-4 text-white">{lastWatchedShow.title}</span>
                            <Link
                                href={'/explore'}
                                className="text-lg md:text-xl antialiased w-3/4 text-center ml-4 text-zinc-400 flex justify-center items-center gap-3 mt-1 hover:text-zinc-200 transition-colors"
                            >
                                Explorar <FaArrowRight />
                            </Link>
                        </div>

                        {currentReview && (
                            <div className="hidden flex-col p-8 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark mt-2 md:flex">
                                <div className="flex">
                                    <div className="flex gap-4">
                                        {currentReview.user?.photoURL && (
                                            <img
                                                id="avatar"
                                                src={currentReview.user.photoURL}
                                                className="rounded-full h-10 w-10 cursor-pointer"
                                                alt="Avatar"
                                                onClick={() => router.push(`/profile/${currentReview.user?.id}`)}
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <div className="flex gap-3 items-center -mt-1">
                                                {currentReview.user?.displayName && (
                                                    <p
                                                        onClick={() => router.push(`/profile/${currentReview.user?.id}`)}
                                                        className="font-semibold cursor-pointer text-white"
                                                    >
                                                        {currentReview.user.displayName}
                                                    </p>
                                                )}
                                            </div>
                                            {currentReview.rating && (
                                                <div className="text-xl tracking-[2px] flex">
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <RenderStars key={index} index={index + 1} movieRating={currentReview.rating} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="italic mt-4 text-[18px] text-white font-normal break-words w-[500px]">{currentReview.review}</div>
                                <div className="flex flex-col text-white text-[12px] mt-4">
                                    <span>{currentReview.reviewed_at}</span>
                                    <span className="text-xs text-gray-400">{`Assistido com o grupo: ${currentReview.groupName}`}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-[400px] h-[270px] md:h-[450px] md:w-[300px]">
                        {lastWatchedShow.posterUrl && (
                            <img src={lastWatchedShow.posterUrl} alt="Pôster do filme" className="w-full h-full select-none shadow-xl" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ShowBanner
