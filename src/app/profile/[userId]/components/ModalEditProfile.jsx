"use client"
import { useAuth } from "@/app/context/auth-context"
import ToastCustom from "@/app/dashboard/components/ToastCustom"
import { getMovieBackdrop, saveProfileEdit, searchFavoriteMovie } from "@/app/lib/userApi"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"

const ModalEditProfile = ({ toggleModalEditProfile, isModalEditProfile }) => {
    const { user } = useAuth()
    const [searchMovie, setSearchMovie] = useState("")
    const [bio, setBio] = useState("")
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [backdrops, setBackdrops] = useState([])
    const [currentBackdropIndex, setCurrentBackdropIndex] = useState(null)
    const [selectedBackdrop, setSelectedBackdrop] = useState(null)
    const [isModalClosing, setIsModalClosing] = useState(null)
    const router = useRouter()
    const genreMap = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Science Fiction",
        10770: "TV Movie",
        53: "Thriller",
        10752: "War",
        37: "Western",
    }

    const closeModal = () => {
        setIsModalClosing(true)
        setTimeout(() => {
            setIsModalClosing(false)
            setSelectedMovie(null)
            toggleModalEditProfile()
        }, 500)
    }

    useEffect(() => {
        if (searchMovie !== "") {
            const movieName = async () => {
                try {
                    const response = await searchFavoriteMovie(searchMovie)
                    setMovies(response)
                } catch (e) {
                    console.error(e)
                }
            }
            movieName()
        }
    }, [searchMovie])

    const favoriteMovieBackdrop = async (movieId) => {
        try {
            const response = await getMovieBackdrop(movieId)
            const filteredBackdrops = (response || []).filter(
                (backdrop) => !backdrop.iso_639_1 || backdrop.iso_639_1 === "en" || backdrop.iso_639_1 === "pt"
            )
            setBackdrops(filteredBackdrops)
        } catch (e) {
            console.error(e)
        }
    }

    const editProfile = async () => {
        if (selectedMovie && selectedBackdrop !== null) {
            try {
                // Salva o filme favorito e o backdrop no Firestore
                await saveProfileEdit(user.uid, selectedMovie, backdrops[selectedBackdrop].file_path, bio)
                // Exibir Toast ou sucesso
                toast.success("Filme favorito salvo com sucesso!")

                return true
            } catch (error) {
                console.error("Erro ao salvar filme favorito:", error)
                // Exibir Toast ou erro
                toast.error("Erro ao salvar filme favorito.")
            }
        }
    }

    const handleEditProfile = async () => {
        const profileEdited = await editProfile()

        if (profileEdited) {
            setTimeout(() => {
                closeModal()
                router.refresh()
            }, 1200)
        }
    }
    return (
        <>
            {isModalEditProfile && (
                <div
                    className={`fixed flex justify-center p-12 z-50 w-dvw h-dvh bg-black/40 transition duration-300 ${
                        isModalClosing ? "animate-fadeOut" : "animate-fadeIn"
                    }`}
                >
                    <div className="w-[600px] h-[650px] bg-secondary-dark pt-10 pb-10 pl-12 pr-12 overflow-auto rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl">Editar Perfil</span>
                            <button onClick={closeModal} className="cursor-pointer">
                                X
                            </button>
                        </div>
                        <div className="flex items-center w-full mt-4 space-x-4">
                            <textarea
                                onChange={(e) => setBio(e.target.value)}
                                className="flex-1 px-4 py-2 pt-3 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark text-white resize-none"
                                placeholder="Bio..."
                                rows="2"
                            ></textarea>
                        </div>

                        <div className="mt-8">
                            <input
                                type="text"
                                placeholder="Pesquise seu filme favorito..."
                                className="w-full px-4 py-2 rounded-lg bg-primary-dark text-white focus:outline-none"
                                value={searchMovie}
                                onChange={(e) => {
                                    setSearchMovie(e.target.value)
                                }}
                            />
                            {movies.length > 0 && searchMovie !== "" && (
                                <ul className="bg-primary-dark rounded-lg mt-2 max-h-64 overflow-y-auto shadow-lg">
                                    {console.log(movies)}
                                    {movies.map((movie) => (
                                        <li
                                            key={movie.id}
                                            className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                            onClick={() => {
                                                setSelectedMovie(movie) // Define o filme selecionado
                                                setMovies([]) // Limpa a lista após a seleção
                                                setSearchMovie("") // Reseta o input
                                                favoriteMovieBackdrop(movie.id)
                                            }}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-12 h-18 object-cover mr-4"
                                            />
                                            <span className="text-white truncate">{movie.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {selectedMovie && (
                                <>
                                    <div className="flex justify-around items-center mt-2 p-4 bg-primary-dark rounded-lg">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${selectedMovie.poster_path}`}
                                            alt={selectedMovie.title}
                                            className="w-28 h-40 object-cover mr-4"
                                        />
                                        <div className="flex justify-center items-center flex-col">
                                            <span className="text-white text-xl font-bold text-center">{selectedMovie.title}</span>
                                            <span className="text-sm text-gray-500 bg-gray-950/20 rounded-lg p-1 mt-1">
                                                {genreMap[selectedMovie.genre_ids[0]]}
                                            </span>
                                        </div>
                                    </div>

                                    {console.log(backdrops)}
                                    {backdrops.length > 0 && (
                                        <div className="mt-6 p-4 bg-primary-dark rounded-lg h-[300px] overflow-auto">
                                            <h3 className="text-white text-lg mb-4">Escolha uma imagem para o fundo do seu perfil:</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {backdrops.map((backdrop, index) => (
                                                    <div
                                                        key={index}
                                                        className={`relative cursor-pointer rounded-lg ${
                                                            selectedBackdrop === index ? "border-4 border-green-500" : ""
                                                        }`}
                                                        onClick={() => setCurrentBackdropIndex(index)}
                                                    >
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w300${backdrop.file_path}`}
                                                            alt={`Backdrop ${index + 1}`}
                                                            className="w-full h-auto rounded-lg"
                                                        />
                                                        {selectedBackdrop === index && (
                                                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            {currentBackdropIndex !== null && (
                                <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-50">
                                    <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setCurrentBackdropIndex(null)}>
                                        X
                                    </button>
                                    <button
                                        className="absolute left-4 text-white text-3xl"
                                        onClick={() => setCurrentBackdropIndex((currentBackdropIndex - 1 + backdrops.length) % backdrops.length)}
                                    >
                                        &#8249;
                                    </button>
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${backdrops[currentBackdropIndex].file_path}`}
                                        alt={`Backdrop ${currentBackdropIndex + 1}`}
                                        className="max-w-4xl max-h-[80%] object-contain"
                                    />
                                    <button
                                        className="absolute right-4 text-white text-3xl"
                                        onClick={() => setCurrentBackdropIndex((currentBackdropIndex + 1) % backdrops.length)}
                                    >
                                        &#8250;
                                    </button>
                                    <button
                                        className="mt-4 bg-white text-black px-4 py-2 rounded-lg"
                                        onClick={() => {
                                            setSelectedBackdrop(currentBackdropIndex)
                                            setCurrentBackdropIndex(null)
                                        }}
                                    >
                                        Selecionar
                                    </button>
                                </div>
                            )}
                            <div className="mt-8 flex justify-end items-center">
                                <button
                                    onClick={handleEditProfile}
                                    className="bg-primary-dark text-white p-4 rounded-md transition hover:bg-primary-dark/50"
                                >
                                    Finalizar
                                </button>
                            </div>
                        </div>
                    </div>
                    <ToastCustom />
                </div>
            )}
        </>
    )
}

export default ModalEditProfile
