'use client'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@heroui/avatar'
import { Card, CardBody } from '@heroui/card'
import Image from 'next/image'
import Link from 'next/link'
import { useContentType } from '@/app/context/contentTypeProvider'
import { useRouter } from 'next/navigation'
import { getReviewByTitle } from '@/app/lib/userApi'
import { Chip } from '@heroui/chip'

const ITEMS_PER_PAGE = 8

const CardsReviews = ({ reviews }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [filteredReviews, setFilteredReviews] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selectedSuggestion, setSelectedSuggestion] = useState([])
    const [reviewsToShow, setReviewsToShow] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const { contentType } = useContentType()
    const router = useRouter()

    useEffect(() => {
        const rr = reviews.filter((r) => r.content === contentType)
        setFilteredReviews(rr)
        setReviewsToShow(rr)
        setTotalPages(Math.ceil(rr.length / ITEMS_PER_PAGE))
        setCurrentPage(1)
    }, [reviews])

    useEffect(() => {
        router.refresh()
    }, [contentType])

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await getReviewByTitle(searchTerm, contentType)
                setSuggestions(response.slice(0, 5))
            } catch (e) {
                console.error(e)
            }
        }
        fetchSuggestions()
    }, [searchTerm])

    useEffect(() => {
        setIsSearching(false)
        if (selectedSuggestion.length > 0) {
            const newReviewsToShow = filteredReviews.filter((r) => {
                return selectedSuggestion.some((s) => {
                    return s.id === r.id_movie
                })
            })

            setReviewsToShow(newReviewsToShow)
            setTotalPages(Math.ceil(newReviewsToShow.length / ITEMS_PER_PAGE))
            setCurrentPage(1)
        }
    }, [selectedSuggestion, reviews])

    const handleSuggestions = (type, suggestion) => {
        switch (type) {
            case 'add':
                setSelectedSuggestion((prev) => {
                    const exists = prev.some((item) => item.id === suggestion.id)

                    if (!exists) {
                        return [...prev, suggestion]
                    }

                    return prev
                })
                setSearchTerm('')

                break
            case 'del':
                setSelectedSuggestion((prev) => prev.filter((item) => item.id !== suggestion.id))
                setReviewsToShow(filteredReviews)
                setTotalPages(Math.ceil(filteredReviews.length / ITEMS_PER_PAGE))
                setCurrentPage(1)
        }
    }

    const paginatedReviews = reviewsToShow.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    return (
        <>
            <div className="relative w-dvw flex justify-center">
                <input
                    className="w-[42rem] p-4 rounded-full border border-gray-400 focus:outline-none focus:border-gray-100"
                    placeholder="Buscar..."
                    type="text"
                    value={searchTerm}
                    onFocus={() => setIsSearching(true)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {suggestions.length > 0 && isSearching && (
                    <ul className="absolute z-30 md:w-[42rem] mt-[4.5rem] bg-secondary-dark shadow-lg rounded-lg overflow-hidden">
                        {suggestions.map((suggestion) => (
                            <li
                                onClick={() => handleSuggestions('add', suggestion)}
                                key={suggestion.id}
                                className="p-3 cursor-pointer hover:bg-zinc-500 flex items-center gap-3"
                            >
                                <Image
                                    src={suggestion.poster_path}
                                    alt={suggestion.original_title || 'Poster'}
                                    width={50}
                                    height={75}
                                    className="rounded-md object-cover"
                                />

                                <span className="text-white">{suggestion.title || suggestion.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedSuggestion.length > 0 && (
                <ul className="flex justify-center items-center gap-3 w-[34rem] flex-wrap mt-3">
                    {selectedSuggestion.map((s) => (
                        <li key={s.id}>
                            <Chip onClose={() => handleSuggestions('del', s)}>{s.title || s.name}</Chip>
                        </li>
                    ))}
                </ul>
            )}
            <div className="p-12 flex flex-wrap justify-center items-center gap-6">
                {paginatedReviews.length < 1 && <p className="text-gray-500 text-center">Nenhuma review encontrada.</p>}
                {paginatedReviews?.map((review) => (
                    <Card className="hover:scale-105 max-w-96 flex flex-col" key={review.keyId}>  
                            <Image src={review.backdrop_path} alt="Backdrop" width={500} height={300} className="w-full h-56 object-cover" />
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
