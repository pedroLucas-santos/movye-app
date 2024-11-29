import { useAuth } from "@/app/context/auth-context"
import ToastCustom from "@/app/dashboard/components/ToastCustom"
import RenderStars from "@/app/shared/RenderStars"
import { useState, useEffect, useLayoutEffect } from "react"
import { useSelectionReview } from "../../context/selectionEditReview"
import { fetchEditReview, fetchMoviesWatched } from "@/app/lib/movieApi"
import { toast } from "react-toastify"

const ModalReviewEdit = ({ toggleModalReviewEdit, isModalReviewEdit }) => {
    const [isModalClosing, setIsModalClosing] = useState(null)
    const { user } = useAuth()
    const { selectedReview } = useSelectionReview()
    const [reviewEdit, setReviewEdit] = useState(null)
    const [newReview, setNewReview] = useState('')
    const [movieData, setMovieData] = useState(null)

    const closeModal = () => {
        setIsModalClosing(true)
        setTimeout(() => {
            setIsModalClosing(false)
            toggleModalReviewEdit()
        }, 500)
    }

    useLayoutEffect(() => {
        const fetchReviewToEdit = async () => {
            try {
                const response = await fetchEditReview(user.uid, selectedReview)
                console.log(response)
                setReviewEdit(response)
                setNewReview(response.review)
            }catch (e) {
                toast.error('Nenhuma review encontrada!')
                return false
            }
        }

        fetchReviewToEdit()
    }, [selectedReview]);

    return (
        <>
            {isModalReviewEdit && (
                <div
                    className={`fixed flex justify-center p-12 z-10 w-dvw h-dvh bg-black/40 transition duration-300 ${
                        isModalClosing ? "animate-fadeOut" : "animate-fadeIn"
                    }`}
                >
                    <div className="w-[600px] h-[650px] bg-secondary-dark pt-10 pb-10 pl-12 pr-12 overflow-hidden rounded-md">
                        <div className="flex justify-between items-center">
                            <span className="text-2xl">Editar Review</span>
                            <button onClick={closeModal} className="cursor-pointer">
                                X
                            </button>
                        </div>
                        <div className={`gap-8 items-center flex-wrap justify-center mt-4 ${isModalClosing ? "flex animate-fadeIn" : ""}`}>
                            <div className=" border-dashed border-stone-950 w-[500px] h-[300px] flex flex-col items-center rounded-lg overflow-hidden shadow-md">
                                <img src={`https://image.tmdb.org/t/p/original${reviewEdit?.backdrop_path}`} alt="" className="bg-slate h-[70%] w-full object-cover select-none" />
                                <div className="bg-secondary-dark flex-grow w-full flex justify-between items-center gap-6 pl-12 pr-12">
                                    <span className="text-sm md:text-lg truncate">{reviewEdit?.title}</span>
                                    <div className="text-center flex flex-col gap-2 items-end">
                                        <span className="text-sm bg-indigo-700 p-1">{reviewEdit?.genre}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center w-full mt-4 space-x-4">
                            <img src={user.photoURL} alt="User" className="rounded-full w-10 h-10" />
                            <textarea
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                className="flex-1 px-4 py-2 pt-3 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark text-white resize-none"
                                placeholder="Faça sua review..."
                                rows="2"
                            ></textarea>
                            <div className="rating-container">
                                <p>Avalie o filme:</p>
                                <div className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <RenderStars key={index} index={index + 1} movieRating={5} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end items-center">
                            <button className="bg-primary-dark text-white p-4 rounded-md transition hover:bg-primary-dark/50">
                                Finalizar review
                            </button>
                            <ToastCustom />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ModalReviewEdit
