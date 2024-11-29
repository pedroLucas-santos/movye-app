import { useAuth } from "@/app/context/auth-context"
import { fetchReviewsCard } from "@/app/lib/movieApi"
import RenderStars from "@/app/shared/RenderStars"
import { useEffect, useState } from "react"
import { useSelectionReview } from "../../context/selectionEditReview"
import Image from "next/image"

const ReviewsCard = () => {
    const [reviewsData, setReviewsData] = useState([])
    const { user, loading } = useAuth()
    const { isSelectingReview, setSelectedReview, setIsSelectingReview } = useSelectionReview()
    const [currentSelection, setCurrentSelection] = useState(null)

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

    useEffect(() => {
        if (!user?.uid) return

        const fetchReviewsData = async () => {
            try {
                const response = await fetchReviewsCard(user.uid)
                setReviewsData(response)
            } catch (error) {
                console.error(error)
            }
        }

        fetchReviewsData()
    }, [user?.uid])

    useEffect(() => {
        if (!isSelectingReview) {
            setCurrentSelection(null)
        }
    }, [isSelectingReview])

    //criar modal para editar review quando clicar no OK

    return (
        <div className="w-full h-full overflow-y-auto flex items-center justify-center bg-stone-950 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-24 max-h-screen">
                {reviewsData.map((review) => (
                    <div
                        key={review.id_movie}
                        className={`bg-gray-800 text-white rounded-lg shadow-md overflow-hidden transition-transform transform ${
                            isSelectingReview ? "hover:scale-100" : "hover:scale-105"
                        } duration-300`}
                    >
                        <div className="w-full h-[600px] relative">
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
                                <button onClick={handleReviewSelection} className="m-2 p-2 bg-green-700 text-white rounded-lg shadow-md">
                                    OK
                                </button>
                            )}
                        </div>

                        <div className="p-4 flex flex-col gap-2 justify-center">
                            <h3 className="text-lg font-bold truncate">{review.id}</h3>
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
            </div>
        </div>
    )
}

export default ReviewsCard
