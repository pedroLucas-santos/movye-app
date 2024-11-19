import React, { useState, useEffect } from "react"
import { fetchSearchedMovieName, fetchAddMovie } from "../../lib/movieApi"
import { useMovieUpdate } from "../../context/movieUpdateProvider"
import { toast, ToastContainer } from "react-toastify"
import ToastCustom from "./ToastCustom"

const ModalAddMovie = ({ toggleModalAddMovie, isModalAddMovie }) => {
    const [searchInput, setSearchInput] = useState("")
    const [movieName, setMovieName] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(0)
    const [isModalClosing, setIsModalClosing] = useState(null)
    const { triggerUpdate } = useMovieUpdate()

    const selectMovie = (movieId) => {
        setSelectedMovie(movieId)
    }

    const closeModal = () => {
        setIsModalClosing(true)
        setTimeout(() => {
            setIsModalClosing(false)
            toggleModalAddMovie()
        }, 500)
    }

    useEffect(() => {
        if (searchInput !== "") {
            const movieName = async () => {
                try {
                    const response = await fetchSearchedMovieName(searchInput)
                    setMovieName(response)
                } catch (e) {
                    console.error(e)
                }
            }
            movieName()
        }
    }, [searchInput])

    const addMovie = async () => {
        if (selectedMovie) {
            try {
                await fetchAddMovie(selectedMovie)
                toast.success("Filme adicionado com sucesso!")

                triggerUpdate()

                return true
            } catch (e) {
                console.log(e)
                return false
            }
        } else {
            toast.error("Selecione um filme para adicionar!")
            return false
        }
    }

    const handleAddClick = async () => {
        const movieAdded = await addMovie()

        if (movieAdded) {
            setTimeout(() => {
                closeModal()
            }, 1200)
        }
    }

    return (
        <>
            {isModalAddMovie && (
                <div
                    className={`fixed flex justify-center p-12 z-10 w-dvw h-dvh bg-black/40 transition duration-300 ${
                        isModalClosing ? "animate-fadeOut" : "animate-fadeIn"
                    }`}
                >
                    <div className="w-[600px] bg-secondary-dark pt-10 pb-10 pl-12 pr-12 overflow-y-auto rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl">Adicionar filme</span>
                            <button onClick={closeModal} className="cursor-pointer">
                                X
                            </button>
                        </div>
                        <div className="flex justify-center items-center gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Procurar filme..."
                                className="border-2 border-gray-300 p-4 w-full rounded-md text-black"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button
                                className="bg-primary-dark text-white p-4 rounded-md transition hover:bg-primary-dark/50"
                                onClick={handleAddClick}
                            >
                                Adicionar
                            </button>
                        </div>

                        {searchInput !== "" &&
                            movieName
                                .filter((movie) => movie.backdrop_path !== null)
                                .map((movie) => {
                                    return (
                                        <div
                                            key={movie.id}
                                            className="border-2 border-gray-300 p-4 mt-4 flex gap-4 justify-center items-center flex-col opacity-0 animate-fadeIn transition"
                                        >
                                            <ul
                                                className={`w-[90%] border-2 border-cyan-500/0 rounded-lg overflow-hidden shadow-md transition duration-300 hover:transform hover:scale-105 ${
                                                    selectedMovie === movie.id ? "scale-105 border-cyan-500/100" : "scale-100"
                                                }`}
                                                onClick={() => selectMovie(movie.id)}
                                            >
                                                <li key={movie.id} className="h-[200px] flex flex-col items-center opacity-0 animate-fadeIn">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                                        alt={movie.title || "Movie Image"}
                                                        className="bg-slate h-[70%] w-full object-cover"
                                                    />
                                                    <div className="bg-primary-dark w-full flex-grow flex justify-center items-center p-2">
                                                        <span className="text-sm md:text-lg truncate">{movie.title}</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )
                                })}
                    </div>
                    <ToastCustom/>
                </div>
            )}
        </>
    )
}

export default ModalAddMovie
