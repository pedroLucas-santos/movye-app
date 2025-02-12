import { useState, useEffect } from "react"
import { fetchSearchedMovieName, fetchAddMovie } from "@/app/lib/movieApi"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"
import { toast } from "react-toastify"
import { useGroup } from "@/app/context/groupProvider"
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal"
import Image from "next/image"
import { useContentType } from "@/app/context/contentTypeProvider"
import { fetchAddShow, fetchSearchedShowName } from "@/app/lib/showApi"

const ModalAddMovie = () => {
    const [searchInput, setSearchInput] = useState("")
    const [movieName, setMovieName] = useState([])
    const [showName, setShowName] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(0)
    const [selectedShow, setSelectedShow] = useState(0)
    const { triggerUpdate } = useMovieUpdate()
    const { selectedGroup } = useGroup()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { contentType, setContentType } = useContentType()
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

        10759: "Action & Adventure",
        10762: "Kids",
        10763: "News",
        10764: "Reality",
        10765: "Sci-Fi & Fantasy",
        10766: "Soap",
        10767: "Talk",
        10768: "War & Politics",
    }

    const selectMovie = (movieId) => {
        setSelectedMovie(movieId)
    }

    const selectShow = (showId) => {
        setSelectedShow(showId)
    }

    useEffect(() => {
        if (searchInput !== "") {
            if (contentType === "movie") {
                const movieName = async () => {
                    try {
                        const response = await fetchSearchedMovieName(searchInput, selectedGroup.id)
                        setMovieName(response)
                    } catch (e) {
                        console.error(e)
                    }
                }
                movieName()
            } else if (contentType === "tv") {
                const showName = async () => {
                    try {
                        const response = await fetchSearchedShowName(searchInput, selectedGroup.id)
                        setShowName(response)
                    } catch (e) {
                        console.error(e)
                    }
                }
                showName()
            }
        }
    }, [searchInput])

    const addMovie = async () => {
        if (selectedMovie) {
            try {
                await fetchAddMovie(selectedMovie, selectedGroup.id)
                toast.success("Filme adicionado com sucesso!")

                //arrumar o bug do toast

                return true
            } catch (e) {
                return false
            }
        } else {
            toast.error("Selecione um filme para adicionar!")
            return false
        }
    }

    const addShow = async () => {
        if (selectedShow) {
            try {
                await fetchAddShow(selectedShow, selectedGroup.id)
                toast.success("Série adicionada com sucesso!")

                //arrumar o bug do toast

                return true
            } catch (e) {
                return false
            }
        } else {
            toast.error("Selecione uma série para adicionar!")
            return false
        }
    }

    const handleAddClick = async () => {
        if (contentType === "movie") {
            const movieAdded = await addMovie()

            if (movieAdded) {
                setTimeout(() => {
                    onOpenChange()
                    triggerUpdate()
                    toast.done()
                }, 1200)
                setSelectedMovie(null)
                setSearchInput("")
            }
        }
        
        if(contentType === 'tv') {
            const showAdded = await addShow()

            if (showAdded) {
                setTimeout(() => {
                    onOpenChange()
                    triggerUpdate()
                    toast.done()
                }, 1200)
                setSelectedShow(null)
                setSearchInput("")
            }
        }
    }

    return (
        <>
            <button
                onClick={onOpen}
                className="bg-transparent text-white md:border-2 text-lg md:text-base transition duration-150 hover:border-white/10 hover:bg-secondary-dark md:p-2 rounded-md"
            >
                {contentType === "movie" ? "Adicionar Filme" : "Adicionar Série"}
            </button>
            <Modal className="dark text-white" placement="top" scrollBehavior="inside" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="text-2xl">{contentType === "movie" ? "Adicionar filme" : "Adicionar série"}</ModalHeader>
                    <ModalBody>
                        <div className="flex justify-center items-center gap-4 pb-2">
                            <input
                                type="text"
                                placeholder={contentType === "movie" ? "Procurar filme..." : "Procurar série..."}
                                className="border-2 border-gray-300 p-4 w-full rounded-md text-white"
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
                            contentType === "movie" &&
                            movieName
                                .filter((movie) => movie.backdrop_path !== null)
                                .map((movie) => {
                                    const firstGenre = movie.genre_ids && movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] : "Sem Gênero"
                                    return (
                                        <div
                                            key={movie.id}
                                            className="p-4 mt-4 flex gap-4 justify-center items-center flex-col opacity-0 animate-fadeIn transition"
                                        >
                                            <ul
                                                className={`w-[90%] border-2 border-cyan-500/0 rounded-lg overflow-hidden shadow-md transition duration-300 hover:transform hover:scale-105 ${
                                                    selectedMovie === movie.id ? "scale-105 border-cyan-500/100" : "scale-100"
                                                }`}
                                                onClick={() => selectMovie(movie.id)}
                                            >
                                                <li key={movie.id} className="h-[250px] flex flex-col items-center opacity-0 animate-fadeIn">
                                                    <Image
                                                        width={1280}
                                                        height={1720}
                                                        quality={100}
                                                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                                        alt={movie.title || "Movie Image"}
                                                        className="bg-slate h-[70%] w-full object-cover"
                                                    />
                                                    <div className="bg-primary-dark w-full flex-grow flex justify-center items-center p-2 flex-col">
                                                        <span className="text-sm md:text-lg truncate max-w-full">{movie.title}</span>
                                                        <span className="text-xs md:text-sm text-gray-500 bg-gray-950/20 rounded-lg p-1 mt-1">
                                                            {firstGenre}
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )
                                })}

                        {searchInput !== "" &&
                            contentType === "tv" &&
                            showName
                                .filter((show) => show.backdrop_path !== null)
                                .map((show) => {
                                    const firstGenre = show.genre_ids && show.genre_ids.length > 0 ? genreMap[show.genre_ids[0]] : "Sem Gênero"
                                    return (
                                        <div
                                            key={show.id}
                                            className="p-4 mt-4 flex gap-4 justify-center items-center flex-col opacity-0 animate-fadeIn transition"
                                        >
                                            {console.log(show)}
                                            <ul
                                                className={`w-[90%] border-2 border-cyan-500/0 rounded-lg overflow-hidden shadow-md transition duration-300 hover:transform hover:scale-105 ${
                                                    selectedShow === show.id ? "scale-105 border-cyan-500/100" : "scale-100"
                                                }`}
                                                onClick={() => selectShow(show.id)}
                                            >
                                                <li key={show.id} className="h-[250px] flex flex-col items-center opacity-0 animate-fadeIn">
                                                    <Image
                                                        width={1280}
                                                        height={1720}
                                                        quality={100}
                                                        src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
                                                        alt={show.name || "Movie Image"}
                                                        className="bg-slate h-[70%] w-full object-cover"
                                                    />
                                                    <div className="bg-primary-dark w-full flex-grow flex justify-center items-center p-2 flex-col">
                                                        <span className="text-sm md:text-lg truncate max-w-full">{show.name}</span>
                                                        <span className="text-xs md:text-sm text-gray-500 bg-gray-950/20 rounded-lg p-1 mt-1">
                                                            {firstGenre}
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )
                                })}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalAddMovie
