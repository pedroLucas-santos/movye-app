"use client"
import React, { useEffect, useState } from "react"
import ModalAddMovie from "../dashboard/components/ModalAddMovie"
import ModalReviewMovie from "../dashboard/components/ModalReviewMovie"
import { signOut } from "firebase/auth"
import { auth } from "@/app/lib/firebase-config"
import { useAuth } from "@/app/context/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useSelectionReview } from "../context/selectionEditReview"
import ModalReviewEdit from "../reviews/components/ModalReviewEdit"

const NavBar = () => {
    const [isProfileDropdown, setProfileDropdown] = useState(false)
    const [isModalAddMovie, setModalAddMovie] = useState(false)
    const [isModalReviewMovie, setModalReviewMovie] = useState(false)
    const [isModalReviewEdit, setModalReviewEdit] = useState(false)
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { isSelectingReview, setIsSelectingReview, selectedReview } = useSelectionReview()

    const toggleProfileDropdown = () => {
        setProfileDropdown(!isProfileDropdown)
    }

    const toggleModalAddMovie = () => {
        setModalAddMovie(!isModalAddMovie)
    }

    const toggleModalReviewMovie = () => {
        setModalReviewMovie(!isModalReviewMovie)
    }

    const toggleModalReviewEdit = () => {
        setModalReviewEdit(!isModalReviewEdit)
    }

    useEffect(() => {
        if (selectedReview) {
            toggleModalReviewEdit()
        }
    }, [selectedReview])

    const logout = async () => {
        try {
            await signOut(auth)
            router.push("/login")
        } catch (err) {
            console.error(err)
        }
    }

    const reviewsPage = () => {
        router.push("/reviews")
    }

    return (
        <>
            {isModalAddMovie && <ModalAddMovie toggleModalAddMovie={toggleModalAddMovie} isModalAddMovie={isModalAddMovie} />}

            {isModalReviewMovie && <ModalReviewMovie toggleModalReviewMovie={toggleModalReviewMovie} isModalReviewMovie={isModalReviewMovie} />}

            {isModalReviewEdit && <ModalReviewEdit toggleModalReviewEdit={toggleModalReviewEdit} isModalReviewEdit={isModalReviewEdit} />}

            <nav className="flex justify-around items-center h-32 w-full">
                <button id="menu-toggle" className="text-white md:hidden focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <div id="logo">
                    <span className="font-bold text-3xl select-none">Movye</span>
                </div>

                <div>
                    <ul className="hidden md:flex items-center justify-center">
                        <li>
                            <a href="/dashboard" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Explorar
                            </a>
                        </li>
                        <li>
                            <a href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Sugestões
                            </a>
                        </li>
                        <li>
                            <a href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Estatisticas
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="flex justify-center items-center gap-4">
                    {pathname === "/dashboard" && (
                        <div className="flex gap-4">
                            <button
                                onClick={toggleModalReviewMovie}
                                className="bg-zinc-100 text-black border-2 transition duration-150 hover:bg-zinc-500 p-2 rounded-md"
                            >
                                Adicionar Review
                            </button>

                            <button
                                onClick={toggleModalAddMovie}
                                className="bg-transparent text-white border-2 transition duration-150 hover:border-white/10 hover:bg-secondary-dark p-2 rounded-md"
                            >
                                Adicionar Filme
                            </button>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center items-center">
                        {pathname === "/reviews" && (
                            <button
                                onClick={() => setIsSelectingReview(!isSelectingReview)}
                                className="bg-zinc-100 text-black border-2 transition duration-150 hover:bg-zinc-500 p-2 rounded-md"
                            >
                                Editar Review
                            </button>
                        )}
                        <img id="avatar" src={user.photoURL} className="rounded-full h-10 w-10 cursor-pointer" onClick={toggleProfileDropdown} />
                        {isProfileDropdown && (
                            <div
                                id="userDropdown"
                                className="absolute top-24 right-auto z-10 divide-y divide-gray-100  w-48 bg-secondary-dark rounded-md shadow-md py-2 text-left"
                                data-dropdown-target="userDropdown"
                            >
                                <div className="px-4 py-3 text-sm text-white flex flex-col gap-2">
                                    <span className="text-xl">{user.displayName}</span>
                                    <span className="hover:cursor-pointer">Perfil</span>
                                    <span className="hover:cursor-pointer" onClick={reviewsPage}>
                                        Reviews
                                    </span>
                                    <span className="hover:cursor-pointer" onClick={logout}>
                                        Logout
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar
