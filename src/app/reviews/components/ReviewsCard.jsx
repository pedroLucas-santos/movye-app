import { useAuth } from "@/app/context/auth-context"
import { fetchReviewsCard } from "@/app/lib/movieApi"
import RenderStars from "@/app/shared/RenderStars"
import { useEffect, useState } from "react"

const ReviewsCard = () => {
    const [reviewsData, setReviewsData] = useState([])
    const { user, loading } = useAuth()

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
    //arrumar problema da imagem estar cortada no card
    return (
        <div className="w-full h-full overflow-y-scroll flex items-center justify-center bg-stone-950 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-24 max-h-screen">
                {reviewsData.map((review) => (
                    <div
                        key={review.id}
                        className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                    >
                        <img src={review.posterUrl} alt={review.id} className="w-full h-64 object-cover" />
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-bold">{review.id}</h3>
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
