"use client"
import { useAuth } from "@/app/context/auth-context"
import { fetchDeleteReview, fetchReviewsCard } from "@/app/lib/movieApi"
import RenderStars from "@/app/shared/RenderStars"
import { useEffect, useState } from "react"
import { useSelectionReview } from "../../context/selectionEditReview"
import Image from "next/image"
import { useMovieUpdate } from "../../context/movieUpdateProvider"
import { toast } from "react-toastify"
import ToastCustom from "@/app/dashboard/components/ToastCustom"
import { FiFilter, FiX } from "react-icons/fi"

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
        console.log(currentSelection)
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

                toast.success("Review deletada!")
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

    //criar modal para editar review quando clicar no OK

    const reviewsToDisplay = limit > 0 ? reviewsData.slice(0, limit) : reviewsData;

    return (
        <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-start bg-transparent rounded-lg shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-10">
                {reviewsToDisplay.map((review) => (
                    <div
                        key={review.id_movie}
                        className={`bg-gray-800 text-white rounded-lg shadow-md overflow-hidden transition-transform transform ${
                            isSelectingReview ? "hover:scale-100" : "hover:scale-105"
                        } duration-300`}
                    >
                        {console.log(review)}
                        <div className="w-full h-[600px] relative">
                            {review.posterUrl ? (
                                <Image
                                    className="select-none object-cover"
                                    src={`${review.posterUrl}`}
                                    alt="Review Movie Poster"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 
                                          (max-width: 1200px) 50vw, 
                                          33vw"
                                    priority
                                    quality={100}
                                />
                            ) : (
                                <div className="flex justify-center items-center h-full w-full text-center">
                                    <FiX className="text-5xl" />
                                    <p className="text-sm">Imagem não disponível</p>
                                </div>
                            )}
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

                        <div className="p-4 flex flex-col gap-2 justify-center">
                            <h3 className="text-lg font-bold truncate select-text">{review.id}</h3>
                            <span className="text-sm text-gray-400">{review.genre}</span>
                            <p className="text-sm">{review.review}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="px-2 py-1 rounded-lg flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <RenderStars key={index} index={index + 1} movieRating={review.rating} />
                                    ))}
                                </span>
                                <span className="text-xs text-gray-400">{review.reviewed_at}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <ToastCustom />
            </div>
        </div>
    )
}

export default ReviewsCard
