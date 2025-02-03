import { fetchReviewsCard } from "@/app/lib/movieApi"
import React, { useEffect, useState } from "react"

const ReviewsCard2 = () => {
    const [reviewsData, setReviewsData] = useState([])
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
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-gray-900/70 h-[600px] flex flex-col border border-gray-800">
            <div className="relative h-64">
                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-100 mb-2 hover:text-amber-400 transition-colors">{movie.title}</h3>
                    <StarRating rating={movie.rating} />
                </div>

                <p className="text-gray-400 mb-4 flex-grow leading-relaxed">{movie.review}</p>

                <div className="mt-auto">
                    <span className="text-sm text-gray-500 font-medium">
                        Review by <span className="text-amber-400">{movie.reviewer}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ReviewsCard2
