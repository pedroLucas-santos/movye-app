import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect } from "react"
import { fetchMoviesWatched, fetchMovieReview, fetchUserReviews } from "@/app/lib/movieApi"
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from "@/app/context/auth-context"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"
import ToastCustom from "../../../shared/ToastCustom"
import StarsReview from "@/app/shared/StarsReview"
import { useGroup } from "@/app/context/groupProvider"

const ModalReviewMovie = ({ toggleModalReviewMovie, isModalReviewMovie }) => {
    const [isModalClosing, setIsModalClosing] = useState(null)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [rating, setRating] = useState(0)
    const [watchedMovies, setWatchedMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState({})
    const [selectedMovieId, setSelectedMovieId] = useState(0)
    const [review, setReview] = useState("")
    const { user } = useAuth()
    const { triggerUpdate, updateSignal } = useMovieUpdate()
    const {selectedGroup} = useGroup()

    const closeModal = () => {
        setIsModalClosing(true)
        // Após a animação de fade-out (2s), fecha o modal
        setTimeout(() => {
            setIsModalClosing(false)
            toggleModalReviewMovie()
        }, 500) // Duração do fade-out
    }

    const handleRating = (value) => {
        setRating(value)
    }

    const handleMouseEnter = (value) => {
        setHoveredRating(value)
    }

    const handleMouseLeave = () => {
        setHoveredRating(0)
    }

    useEffect(() => {
        const fetchMovieList = async () => {
            try {
                const watchedMoviesResponse = await fetchMoviesWatched(selectedGroup.id)
                const userReviews = await fetchUserReviews(user.uid)

                const reviewedMovieIds = userReviews.map((review) => review.id_movie)

                const moviesToReview = watchedMoviesResponse.filter((movie) => !reviewedMovieIds.includes(movie.id))

                setWatchedMovies(moviesToReview)
            } catch (error) {
                console.error("Erro ao carregar lista de filmes:", error)
            }
        }

        fetchMovieList()
    }, [updateSignal])

    useEffect(() => {
        if (selectedMovieId) {
            const movie = watchedMovies.find((movie) => movie.id === selectedMovieId)

            if (movie) {
                setSelectedMovie(movie)
                console.log(selectedMovie)
            } else {
                console.log("Filme não encontrado para o ID:", selectedMovieId)
            }
        }
    }, [selectedMovieId, watchedMovies])

    const addReview = async () => {
        if (rating && selectedMovieId && review !== "") {
            try {
                const response = await fetchMovieReview(selectedMovieId, rating, selectedMovie, review, user.uid, selectedGroup.id)
                toast.success("Review enviado com sucesso:", response)

                triggerUpdate()

                return true
            } catch (e) {
                console.error(e)
                return false
            }
        } else {
            toast.error("É necessário preencher o rating, filme e review para finalizar sua review!")
            return false
        }
    }

    const handleReview = async () => {
        const reviewAdded = await addReview()

        if (reviewAdded) {
            setTimeout(() => {
                closeModal()
            }, 1200)
        }
    }

    return (
        <div
            className={`fixed flex justify-center p-12 z-10 w-dvw h-dvh bg-black/40 transition duration-300 ${
                isModalClosing ? "animate-fadeOut" : "animate-fadeIn"
            }`}
        >
            <div className="w-[600px] h-[650px] bg-secondary-dark pt-10 pb-10 pl-12 pr-12 overflow-hidden rounded-md">
                <div className="flex justify-between items-center">
                    <span className="text-2xl">Adicionar Review</span>
                    <button onClick={closeModal} className="cursor-pointer">
                        X
                    </button>
                </div>

                <div className="flex justify-center items-center gap-4 mt-4">
                    <select
                        id="movies"
                        name="movies"
                        value={selectedMovieId ? selectedMovieId : ""}
                        onChange={(e) => setSelectedMovieId(+e.target.value)}
                        className="block w-full bg-primary-dark text-white border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                    >
                        <option value="" disabled>
                            Selecione um filme
                        </option>
                        {console.log(watchedMovies)}
                        {watchedMovies.map((movie) => {
                            return (
                                <option key={movie.id} value={movie.id}>
                                    {movie.title}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className={`gap-8 items-center flex-wrap justify-center mt-4 ${selectedMovieId ? "flex animate-fadeIn" : "hidden"}`}>
                    <div className=" border-dashed border-stone-950 w-[500px] h-[300px] flex flex-col items-center rounded-lg overflow-hidden shadow-md">
                        <img
                            src={selectedMovie ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}` : null}
                            alt=""
                            className="bg-slate h-[70%] w-full object-cover select-none"
                        />
                        <div className="bg-secondary-dark flex-grow w-full flex justify-between items-center gap-6 pl-12 pr-12">
                            <span className="text-sm md:text-lg truncate">{selectedMovie.title}</span>
                            <div className="text-center flex flex-col gap-2 items-end">
                                <span className="text-sm text-white bg-gray-950/20 rounded-lg p-1">{selectedMovie.genre}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-full mt-4 space-x-4">
                    <img src={user.photoURL} alt="User" className="rounded-full w-10 h-10" />
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="flex-1 px-4 py-2 pt-3 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark text-white resize-none"
                        placeholder="Faça sua review..."
                        rows="2"
                    ></textarea>
                    <div className="rating-container">
                        <p>Avalie o filme:</p>
                        <div className="flex">
                            {Array.from({ length: 5 }, (_, index) => (
                                <StarsReview
                                    key={index}
                                    index={index + 1}
                                    rating={rating}
                                    hoveredRating={hoveredRating}
                                    handleRating={handleRating}
                                    handleMouseEnter={handleMouseEnter}
                                    handleMouseLeave={handleMouseLeave}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end items-center">
                    <button className="bg-primary-dark text-white p-4 rounded-md transition hover:bg-primary-dark/50" onClick={handleReview}>
                        Finalizar review
                    </button>
                    <ToastCustom />
                </div>
            </div>
        </div>
    )
}

export default ModalReviewMovie
