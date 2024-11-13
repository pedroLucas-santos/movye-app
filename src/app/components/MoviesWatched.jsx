"use client"
import React, { useEffect, useState } from "react"
import { fetchMovieCard, options } from "../lib/movieApi"

const MoviesWatched = () => {
    const [rating, setRating] = useState(0) // Current rating value
    const [hoveredRating, setHoveredRating] = useState(0) // Hovered rating value
    const [backdrop, setBackdrop] = useState(null)

    const handleRating = (value) => {
        setRating(value)
    }

    const handleMouseEnter = (value) => {
        setHoveredRating(value)
    }

    const handleMouseLeave = () => {
        setHoveredRating(0)
    }

    const renderStar = (index) => {
        const isFilled = index <= (hoveredRating || rating)
        return (
            <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill={isFilled ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-5 h-5 cursor-pointer transition-colors ${isFilled ? "text-white" : "text-white/20"}`}
                onClick={() => handleRating(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 17.75l-5.8 3.04 1.1-6.44-4.7-4.58 6.5-.58L12 2l2.9 6.28 6.5.58-4.7 4.58 1.1 6.44L12 17.75z"
                />
            </svg>
        )
    }

    useEffect(() => {
        const fetchCardImage = async () => {
            try {
                const response = await fetchMovieCard(options)
                setBackdrop(response)
            } catch (e) {
                console.error(e)
            }
        }

        fetchCardImage()
    }, [])

    return (
        <div className="border-dashed border-2 border-purple-400 p-4 gap-8 flex flex-col items-center flex-wrap justify-center">
            <span className="text-5xl mt-8">Filmes assistidos</span>
            <div className="gap-8 flex items-center flex-wrap justify-center">
                <div className=" border-dashed border-stone-950 w-[500px] h-[300px] flex flex-col items-center rounded-lg overflow-hidden shadow-md">
                    <img src={backdrop} alt="" className="bg-slate h-[70%] w-full object-cover"/>
                    <div className="bg-secondary-dark flex-grow w-full flex justify-between items-center gap-6 pl-12 pr-12">
                        <span className="text-sm md:text-lg truncate">Lord of The Rings: The Fellowship of The Ring</span>
                        <div className="text-center flex flex-col gap-2 items-end">
                            <span className="text-sm bg-indigo-700 p-1">Aventura</span>
                            <div className="flex">{Array.from({ length: 5 }, (_, index) => renderStar(index + 1))}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoviesWatched
