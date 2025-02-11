"use client"
import { useContentType } from "@/app/context/contentTypeProvider"
import RenderStars from "@/app/shared/RenderStars"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa" // Importe os ícones de seta

export const GroupReviews = ({ reviews, showReviews }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [reviewsToShow, setReviewsToShow] = useState(3)
    const { contentType }= useContentType()
    const [ reviewsByType, setReviewsByType ] = useState([])
    // Função para alternar a visibilidade
    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
        setReviewsToShow(isExpanded ? 3 : reviewsByType.length) // Mostrar mais ou menos
    }

    useEffect(() => {
        if(contentType === 'movie'){
            setReviewsByType(reviews)
        } else{
            setReviewsByType(showReviews)
        }
    }, [contentType])

    return (
        <section className="group-reviews mb-8">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Reviews</h2>
            <ul className="space-y-4">
                {reviewsByType.slice(0, reviewsToShow).map((review, index) => (
                    <li key={index} className="bg-secondary-dark  p-4 rounded-md flex items-center gap-2">
                        <Link href={`/profile/${review.user_id}`} className="w-32">
                            <img src={review.photoURL} alt="" className="rounded-full w-12 h-12" />
                        </Link>
                        <div className="flex flex-col justify-center">
                            <div>
                                <Link href={`/profile/${review.user_id}`}>
                                    <strong className="text-gray-400">{review.displayName}:</strong>
                                </Link>
                                <span className="text-gray-100 ml-2">{review.review}</span>
                            </div>
                            <span className="text-gray-500 text-xs w-96">{review.id}</span>
                        </div>
                        <div className="flex flex-col justify-center items-end w-full gap-2">
                            <div className="flex">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <RenderStars key={index} index={index + 1} movieRating={review.rating} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-xs">
                                {new Intl.DateTimeFormat("pt-BR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                }).format(new Date(review.reviewed_at))}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Botão para expandir ou recolher a lista */}

            <div className="flex justify-center mt-4">
                {reviewsByType.length > 3 && (
                    <button onClick={toggleExpand} className="text-gray-200 hover:text-gray-400 transition-colors">
                        {isExpanded ? (
                            <FaChevronUp className="text-2xl" /> // Ícone de seta para cima
                        ) : (
                            <FaChevronDown className="text-2xl" /> // Ícone de seta para baixo
                        )}
                    </button>
                )}
            </div>
        </section>
    )
}
