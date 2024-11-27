"use client"
import { useEffect, useState } from "react"
import { fetchMoviesWatched } from "../../lib/movieApi"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"

const MoviesWatched = () => {
    const [watchedMovies, setWatchedMovies] = useState([])
    const { updateSignal } = useMovieUpdate()

    const [currentPage, setCurrentPage] = useState(1)
    const moviesPerPage = 9

    const totalPages = Math.ceil(watchedMovies.length / moviesPerPage)

    const renderStar = (index, movieRating) => {
        const isFilled = index <= movieRating
        return (
            <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill={isFilled ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`w-5 h-5 transition-colors ${isFilled ? "text-white" : "text-white/20"}`}
                onClick={() => handleRating(index)}
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
        const fetchWatchedMovies = async () => {
            try {
                const response = await fetchMoviesWatched()
                setWatchedMovies(response)
            } catch (e) {
                console.error(e)
            }
        }

        fetchWatchedMovies()
    }, [updateSignal])

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const indexOfLastMovie = currentPage * moviesPerPage
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
    const currentMovies = watchedMovies.slice(indexOfFirstMovie, indexOfLastMovie)

    return (
        <div className=" p-4 pb-12 gap-8 flex flex-col items-center flex-wrap justify-center">
            <span className="text-5xl mt-8">Filmes assistidos</span>
            <div className="gap-8 flex items-center flex-wrap justify-center">
                {currentMovies.map((movie) => {
                    return (
                        <div
                            key={movie.id}
                            className=" border-dashed border-stone-950 w-[500px] h-[300px] flex flex-col items-center rounded-lg overflow-hidden shadow-md"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                alt=""
                                className="bg-slate h-[70%] w-full object-cover select-none"
                            />
                            <div className="bg-secondary-dark flex-grow w-full flex justify-between items-center gap-6 pl-12 pr-12">
                                <span className="text-sm md:text-lg truncate">{movie.title}</span>
                                <div className="text-center flex flex-col gap-2 items-end">
                                    <span className="text-sm text-gray-500 bg-gray-950/20 rounded-lg p-1">{movie.genre}</span>
                                    <div className="flex">{Array.from({ length: 5 }, (_, index) => renderStar(index + 1, movie.rating))}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Botões de navegação */}
            {totalPages > 1 && (
                <div className="mt-8 flex gap-4 justify-center items-center">
                    <button onClick={prevPage} disabled={currentPage === 1} className="bg-secondary-dark p-2 text-white rounded-md">
                        {"<"}
                    </button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-secondary-dark p-2 text-white rounded-md">
                        {">"}
                    </button>
                </div>
            )}
        </div>
    )
}

export default MoviesWatched
