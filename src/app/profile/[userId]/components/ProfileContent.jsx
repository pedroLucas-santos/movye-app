"use client"
import { useContentType } from "@/app/context/contentTypeProvider"
import { getUserAvgReviews, getUserReviews } from "@/app/lib/userApi"
import RenderStars from "@/app/shared/RenderStars"
import React, { useEffect, useState } from "react"

const ProfileContent = ({ userId, user }) => {
    const { contentType } = useContentType()
    const [reviewCount, setReviewCount] = useState(null)
    const [avgReview, setAvgReview] = useState(null)
    useEffect(() => {
        const fetcher = async () => {
            try {
                const reviewC = await getUserReviews(userId, contentType)
                setReviewCount(reviewC)
                const avgReview = await getUserAvgReviews(userId, contentType)
                setAvgReview(avgReview)
            } catch (err) {
                console.error(err)
            }
        }
        fetcher()
    }, [[], contentType])
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 mt-24 p-4 rounded-xl justify-items-center h-32 content-center mb-12 gap-6 md:gap-0">
            <div className="flex items-center flex-col h-full">
                <h2 className="text-2xl text-white">Reviews:</h2>
                <span className="text-2xl text-white">{reviewCount}</span>
            </div>
            <div className="flex items-center flex-col h-full">
                <h2 className="text-2xl text-white">Média de avaliação:</h2>
                <span className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                        <RenderStars key={index} index={index + 1} movieRating={avgReview} />
                    ))}
                </span>
            </div>
            <div className="flex items-center flex-col h-full">
                <h2 className="text-2xl text-white">{contentType === 'movie' ? 'Filme favorito:' : 'Série favorita:'}</h2>
                <span className="text-2xl text-center text-wrap w-96 text-white">{contentType === 'movie' ? user.favoriteMovie?.title : user.favoriteShow?.name}</span>
            </div>
        </div>
    )
}

export default ProfileContent
