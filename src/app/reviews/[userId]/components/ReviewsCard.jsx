"use client"
import { useAuth } from "@/app/context/auth-context"
import { fetchDeleteReview, fetchReviewsCard } from "@/app/lib/movieApi"
import RenderStars from "@/app/shared/RenderStars"
import { useEffect, useState } from "react"
import { useSelectionReview } from "../../../context/selectionEditReview"
import Image from "next/image"
import { useMovieUpdate } from "../../../context/movieUpdateProvider"
import { toast } from "react-toastify"
import { FiFilter, FiX } from "react-icons/fi"
import StarsReview from "@/app/shared/StarsReview"

const ReviewsCard = ({ userId, limit }) => {
    const [reviewsData, setReviewsData] = useState([])
    const { user, loading } = useAuth()
    const { isSelectingReview, setSelectedReview, setIsSelectingReview } = useSelectionReview()
    const [currentSelection, setCurrentSelection] = useState(null)
    const { triggerUpdate, updateSignal } = useMovieUpdate()

    const handleCheckboxChange = (reviewId) => {
        // Atualiza o estado com o ID do card selecionado ou desmarca
        setCurrentSelection((prev) => (prev === reviewId ? null : reviewId))
    }

    const handleReviewSelection = () => {
        
        if (currentSelection) {
            setSelectedReview(currentSelection)
            setIsSelectingReview(!isSelectingReview)
        }
    }

    const handleReviewDelete = async () => {
        if (currentSelection) {
            // Chama a função para deletar a review
            try {
                await fetchDeleteReview(user.uid, currentSelection)

                setCurrentSelection(null)
                setIsSelectingReview(!isSelectingReview)

                triggerUpdate()

                toast.success("Review excluída!")
            } catch (error) {
                toast.error("Ocorreu um erro ao deletar a review.")
                console.error(error)
            }
        }
    }

    useEffect(() => {
        if (!user?.uid) return

        let userIdToUse

        if (userId) {
            userIdToUse = user.uid === userId ? user.uid : userId
        } else {
            userIdToUse = user.uid
        }

        const fetchReviewsData = async (id) => {
            try {
                const response = await fetchReviewsCard(id)
                setReviewsData(response)
            } catch (error) {
                console.error(error)
            }
        }

        fetchReviewsData(userIdToUse)
    }, [user?.uid, updateSignal])

    useEffect(() => {
        if (!isSelectingReview) {
            setCurrentSelection(null)
        }
    }, [isSelectingReview])

    const reviewsToDisplay = limit > 0 ? reviewsData.slice(0, limit) : reviewsData

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-12 ${limit > 0 ? '' : 'overflow-y-auto'}`}>
            {reviewsToDisplay.map((review) => (
                <div key={review.id_movie} className="bg-gray-900/50 antialiased overflow-y-auto scrollbar-hide backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-gray-900/70 h-[900px] flex flex-col border border-gray-800">
                    <div className="relative min-h-[600px]">
                        {review.posterUrl ? (
                            <Image
                                className="select-none object-cover"
                                src={`${review.posterUrl}`}
                                alt="Review Movie Poster"
                                fill
                                sizes="(max-width: 768px) 100vw, 
                                          (max-width: 1200px) 50vw, 
                                          33vw"
                                quality={100}
                            />
                        ) : (
                            <div className="flex justify-center items-center h-full w-full text-center">
                                <FiX className="text-5xl" />
                                <p className="text-sm">Imagem não disponível</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
                    </div>
                    <div className={`absolute inset-0 ${isSelectingReview ? "bg-black/30" : ""} flex items-start justify-between`}>
                        {isSelectingReview && (
                            <input
                                type="checkbox"
                                className="w-6 h-6 m-2"
                                checked={currentSelection === review.id_movie}
                                onChange={() => handleCheckboxChange(review.id_movie)}
                            />
                        )}
                        {currentSelection === review.id_movie && isSelectingReview && (
                            <div>
                                <button onClick={handleReviewSelection} className="m-2 p-2 bg-green-700 text-white rounded-lg shadow-md">
                                    Editar
                                </button>
                                <button onClick={handleReviewDelete} className="m-2 p-2 bg-red-700 text-white rounded-lg shadow-md">
                                    Excluir
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-100 mb-2 hover:text-amber-400 transition-colors">{review.id}</h3>
                            <div className="flex">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <RenderStars key={index} index={index + 1} movieRating={review.rating} />
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto scrollbar-hide mb-4">
                            <p className="text-gray-400 leading-relaxed pr-2">{review.review}</p>
                        </div>

                        <div className="mt-auto">
                            <span className="text-sm text-gray-500 font-medium flex">
                                <span>{review.reviewed_at}</span>
                                <span>Assistido com o grupo {review.groupName}</span>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ReviewsCard
