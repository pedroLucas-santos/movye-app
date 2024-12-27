"use client"
import { useEffect, useState } from "react"
import { fetchMoviesWatched } from "@/app/lib/movieApi"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"
import RenderStars from "@/app/shared/RenderStars"
import "@/app/Header.css"
import { useGroup } from "@/app/context/groupProvider"

const MoviesWatched = () => {
    const [watchedMovies, setWatchedMovies] = useState([])
    const { updateSignal } = useMovieUpdate()
    const { selectedGroup } = useGroup()

    const [currentPage, setCurrentPage] = useState(1)
    const moviesPerPage = 9

    const totalPages = Math.ceil(watchedMovies.length / moviesPerPage)

    useEffect(() => {
        const fetchWatchedMovies = async () => {
            try {
                const response = await fetchMoviesWatched(selectedGroup.id)
                setWatchedMovies(response)
            } catch (e) {
                console.error(e)
            }
        }

        fetchWatchedMovies()
    }, [updateSignal]);

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
                            className=" border-dashed border-stone-950 w-[500px] h-[300px] flex flex-col items-center rounded-lg overflow-hidden shadow-md scrollAppear"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                alt=""
                                className="bg-slate h-[70%] w-full object-cover select-none"
                            />
                            <div className="bg-secondary-dark flex-grow w-full flex justify-between items-center gap-6 pl-12 pr-12">
                                <span className="text-sm md:text-lg truncate">{movie.title}</span>
                                <div className="text-center flex flex-col gap-2 items-end">
                                    <span className="text-sm text-white bg-gray-950/20 rounded-lg p-1">{movie.genre}</span>
                                    <div className="flex">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <RenderStars key={index} index={index + 1} movieRating={movie.averageRating} />
                                        ))}
                                    </div>
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
