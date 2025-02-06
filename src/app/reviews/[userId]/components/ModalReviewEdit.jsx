import { useAuth } from "@/app/context/auth-context"
import { useState, useEffect, useLayoutEffect } from "react"
import { useSelectionReview } from "../../../context/selectionEditReview"
import { fetchEditReview, fetchMoviesWatched, fetchUpdateReview } from "@/app/lib/movieApi"
import { toast } from "react-toastify"
import StarsReview from "@/app/shared/StarsReview"
import { useMovieUpdate } from "../../../context/movieUpdateProvider"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal"
import Image from "next/image"

const ModalReviewEdit = ({ toggleModalReviewEdit, isModalReviewEdit }) => {
    const [isModalClosing, setIsModalClosing] = useState(null)
    const { user } = useAuth()
    const { selectedReview, setSelectedReview } = useSelectionReview()
    const [reviewEdit, setReviewEdit] = useState(null)
    const [newReview, setNewReview] = useState("")
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [movieData, setMovieData] = useState(null)
    const { triggerUpdate, updateSignal } = useMovieUpdate()

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const handleRating = (value) => {
        setRating(value)
    }

    const handleMouseEnter = (value) => {
        setHoveredRating(value)
    }

    const handleMouseLeave = () => {
        setHoveredRating(0)
    }

    const closeModal = () => {
        onOpenChange()
        setTimeout(() => {
            setSelectedReview(null)
            toggleModalReviewEdit()
        }, 500)
    }

    const editReview = async () => {
        if(rating === 0) {
            toast.error("Avaliação é obrigatória!")
            return false
        }
        if (rating && selectedReview && newReview !== "") {
            try {
               await fetchUpdateReview(user.uid, selectedReview, newReview, rating)
                
                toast.success("Review editada com sucesso!")

                triggerUpdate()

                return true
            } catch (e) {
                toast.error("Não foi possível editar a review!")
                return false
            }
        }
    }

    const handleReview = async () => {
        const reviewEdited = await editReview()

        if (reviewEdited) {
            setTimeout(() => {
                closeModal()
            }, 1200)
        }
    }

    useLayoutEffect(() => {
        onOpen()
        const fetchReviewToEdit = async () => {
            try {
                const response = await fetchEditReview(user.uid, selectedReview)
                
                setReviewEdit(response)
                setNewReview(response.review)
            } catch (e) {
                toast.error("Nenhuma review encontrada!")
                return false
            }
        }

        fetchReviewToEdit()
    }, [selectedReview])

    return (
        <>
            {isModalReviewEdit && (
                <Modal className="dark text-white" placement="top" scrollBehavior="inside" backdrop="blur" isOpen={isOpen} onOpenChange={closeModal}>
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1 justify-center text-2xl">Editar Review</ModalHeader>
                        <ModalBody>
                            <div className={`gap-8 items-center flex-wrap justify-center`}>
                                <div className=" border-dashed border-stone-950 flex flex-col items-center rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/original${reviewEdit?.backdrop_path}`}
                                        alt="Movie Picture"
                                        className="bg-slate h-[70%] w-full object-cover select-none"
                                        width={1920}
                                        height={1080}
                                        quality={100}
                                    />
                                    <div className="bg-secondary-dark flex-grow w-full h-14 flex justify-between items-center gap-6 pl-12 pr-12">
                                        <span className="text-sm md:text-lg truncate">{reviewEdit?.title}</span>
                                        <div className="text-center flex flex-col gap-2 items-end">
                                            <span className="text-sm text-white bg-gray-950/20 rounded-lg p-1">{reviewEdit?.genre}</span>
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
                        </ModalBody>
                        <ModalFooter>
                            <div className="mt-8 flex justify-end items-center">
                                <button
                                    onClick={handleReview}
                                    className="bg-primary-dark text-white p-4 rounded-md transition hover:bg-primary-dark/50"
                                >
                                    Finalizar review
                                </button>
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}

export default ModalReviewEdit
