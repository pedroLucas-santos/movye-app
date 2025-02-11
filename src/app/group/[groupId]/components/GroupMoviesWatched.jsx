"use client"

import RenderStars from "@/app/shared/RenderStars"
import React, { useEffect, useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import MoviesActions from "./MoviesActions"
import { useContentType } from "@/app/context/contentTypeProvider"

const GroupMoviesWatched = ({ watchedMovies, groupId, groupCreatorId, watchedShows }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [contentToShow, setContentToShow] = useState([])
    const {contentType} = useContentType()

    // Função para alternar a visibilidade da lista
    const toggleExpand = () => setIsExpanded(!isExpanded)

    // Número de filmes a mostrar por vez
    const moviesToShow = isExpanded ? contentToShow.length : 3 // Exibe até 6 filmes por vez

    useEffect(() => {
        if(contentType === 'movie'){
            setContentToShow(watchedMovies)
        }else {
            setContentToShow(watchedShows)
        }
    })

    return (
        <section className="watched-movies mb-8">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">{contentType === 'movie' ? 'Filmes Assistidos' : 'Séries Assistidas'}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentToShow.slice(0, moviesToShow).map((movie) => (
                    <li key={movie.id} className="bg-secondary-dark p-4 rounded-lg shadow-md hover:shadow-lg transition-all w-full">
                        <div>
                            {/* Imagem do filme */}
                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                alt={movie.title}
                                className="max-w-full h-48 object-cover rounded-md mb-4"
                            />

                            {/* Título e Gênero */}
                            <h3 className="text-gray-200 text-lg font-semibold">{movie.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{movie.genre}</p>

                            {/* Estrelas de Avaliação */}
                            <div className="flex w-full justify-between">
                                <div className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <RenderStars key={index} index={index + 1} movieRating={movie.averageRating} />
                                    ))}
                                </div>
                                <MoviesActions groupId={groupId} movieId={movie.doc_id} movieTitle={movie.title} groupCreatorId={groupCreatorId}/>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Botão para expandir ou recolher a lista com ícones de seta */}
            <div className="flex justify-center mt-4">
                {watchedMovies.length > 3 && (
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

export default GroupMoviesWatched
