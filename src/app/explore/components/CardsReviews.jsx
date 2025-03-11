'use client'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@heroui/avatar'
import { Card, CardBody } from '@heroui/card'
import Image from 'next/image'
import Link from 'next/link'
import { useContentType } from '@/app/context/contentTypeProvider'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const ITEMS_PER_PAGE = 8

const CardsReviews = ({ reviews }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [filteredReviews, setFilteredReviews] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const { contentType } = useContentType()
    const router = useRouter()

    useEffect(() => {
        const rr = reviews.filter((r) => r.content === contentType)
        setFilteredReviews(rr)
        setTotalPages(Math.ceil(rr.length / ITEMS_PER_PAGE))
        setCurrentPage(1) // Resetar para a primeira página ao mudar o filtro
    }, [contentType, reviews])

    useEffect(() => {
        revalidatePath('/')
    }, [[],contentType])

    const paginatedReviews = filteredReviews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    return (
        <>
            <div className="p-12 flex flex-wrap justify-center items-center gap-6">
                {paginatedReviews.map((review) => (
                    <Card className="hover:scale-105 max-w-96 flex flex-col" key={review.keyId}>
                        <Image src={review.backdrop_path} alt="Movie Banner" width={500} height={300} className="w-full h-56 object-cover" />
                        <CardBody className="p-4 flex flex-col justify-between h-60 max-h-60 overflow-hidden">
                            <div className="flex items-center gap-3">
                                <Link href={`profile/${review.user_id}`}>
                                    <Avatar src={review.photoURL} name={review.displayName} />
                                </Link>
                                <div>
                                    <p className="font-semibold text-lg">{review.displayName}</p>
                                    <p className="text-sm text-gray-500">{review.reviewed_at}</p>
                                </div>
                            </div>
                            <div className="flex-1 mt-4 text-gray-300 overflow-auto break-words max-h-24 scrollbar-hide hover:scrollbar-default transition">
                                <p className="whitespace-pre-line">{review.review}</p>
                            </div>
                            <p className="mt-4 text-gray-600 self-end place-self-end text-right break-words">{review.id}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                        className="bg-secondary-dark p-2 text-white rounded-md"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        {'<'}
                    </button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="bg-secondary-dark p-2 text-white rounded-md"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                        {'>'}
                    </button>
                </div>
            )}
        </>
    )
}

export default CardsReviews