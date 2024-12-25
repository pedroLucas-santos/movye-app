"use client"
import React, { useEffect, useState } from "react"
import ModalAddMovie from "@/app/[groupName]/dashboard/components/ModalAddMovie"
import ModalReviewMovie from "@/app/[groupName]/dashboard/components/ModalReviewMovie"
import { signOut } from "firebase/auth"
import { auth } from "@/app/lib/firebase-config"
import { useAuth } from "@/app/context/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useSelectionReview } from "../context/selectionEditReview"
import ModalReviewEdit from "../reviews/[userId]/components/ModalReviewEdit"
import NotificationDropdown from "./components/NotificationDropdown"
import { useNotifications } from "../context/notificationProvider"
import ModalEditProfile from "../profile/[userId]/components/ModalEditProfile"
import Link from "next/link"
import { useGroup } from "../context/groupProvider"

const NavBar = ({userFirestore}) => {
    const [isProfileDropdown, setProfileDropdown] = useState(false)
    const [isModalAddMovie, setModalAddMovie] = useState(false)
    const [isModalReviewMovie, setModalReviewMovie] = useState(false)
    const [isModalReviewEdit, setModalReviewEdit] = useState(false)
    const [isModalEditProfile, setModalEditProfile] = useState(false)
    const [isNotificationsDropdown, setIsNotificationsDropdown] = useState(false)

    const { notifications, loading } = useNotifications()
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { isSelectingReview, setIsSelectingReview, selectedReview } = useSelectionReview()
    const { selectedGroup } = useGroup()

    const toggleProfileDropdown = () => {
        setProfileDropdown(!isProfileDropdown)
    }

    const toggleNotificationsDropdown = () => {
        setIsNotificationsDropdown(!isNotificationsDropdown)
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
    const toggleModalEditProfile = () => {
        setModalEditProfile(!isModalEditProfile)
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
        router.push(`/reviews/${user.uid}`)
    }

    const friendsPage = () => {
        router.push("/friends")
    }

    const profilePage = () => {
        router.push(`/profile/${user.uid}`)
    }

    const groupsPage = () => {
        router.push(`/groups/${user.uid}`)
    }

    return (
        <>
            {isModalAddMovie && <ModalAddMovie toggleModalAddMovie={toggleModalAddMovie} isModalAddMovie={isModalAddMovie} />}

            {isModalReviewMovie && <ModalReviewMovie toggleModalReviewMovie={toggleModalReviewMovie} isModalReviewMovie={isModalReviewMovie} />}

            {isModalReviewEdit && <ModalReviewEdit toggleModalReviewEdit={toggleModalReviewEdit} isModalReviewEdit={isModalReviewEdit} />}

            {isModalEditProfile && <ModalEditProfile toggleModalEditProfile={toggleModalEditProfile} isModalEditProfile={isModalEditProfile} userFirestore={userFirestore} />}

            <nav className="flex justify-around items-center h-32 w-full relative">
                <button id="menu-toggle" className="text-white md:hidden focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <div id="logo">
                    <span onClick={() => router.push(`/${selectedGroup?.name}/dashboard`)} className="font-bold text-3xl select-none hover:cursor-pointer">Movye</span>
                </div>

                <div>
                    <ul className="hidden md:flex items-center justify-center">
                        <li>
                            <Link href={`/${selectedGroup?.name}/dashboard`} className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Explorar
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Sugestões
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Estatisticas
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="flex justify-center items-center gap-4">
                    {pathname.match(/\/.*\/dashboard/) && (
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
                        {pathname === `/reviews/${user?.uid}` && (
                            <button
                                onClick={() => setIsSelectingReview(!isSelectingReview)}
                                className="bg-zinc-100 text-black border-2 transition duration-150 hover:bg-zinc-500 p-2 rounded-md"
                            >
                                Editar Review
                            </button>
                        )}
                        {pathname === `/profile/${user?.uid}` ? (
                            <button onClick={toggleModalEditProfile} className="bg-zinc-100 text-black border-2 transition duration-150 hover:bg-zinc-500 p-2 rounded-md">
                                Editar Perfil
                            </button>
                        ) : null}
                        <img id="avatar" src={user?.photoURL} className="rounded-full h-10 w-10 cursor-pointer select-none" onClick={toggleProfileDropdown} />
                        <button onClick={toggleNotificationsDropdown} id="notifications" className="relative text-white focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
                                ></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                            {notifications.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-4 flex items-center justify-center rounded-full">
                                    {notifications > 9 ? "+9" : notifications.length}
                                </span>
                            )}
                        </button>
                        {console.log(notifications)}
                        <NotificationDropdown isNotificationsDropdown={isNotificationsDropdown} notifications={notifications} loading={loading} />
                        {isProfileDropdown && (
                            <div
                                id="userDropdown"
                                className="absolute top-24 right-auto z-10 divide-y divide-gray-100  w-48 bg-secondary-dark rounded-md shadow-md py-2 text-left"
                                data-dropdown-target="userDropdown"
                            >
                                <div className="px-4 py-3 text-sm text-white flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-xl">{user.displayName}</span>
                                        <span className="text-sm text-gray-500">{`Grupo selecionado: ${selectedGroup?.name}`}</span>
                                    </div>
                                    <span className="hover:cursor-pointer" onClick={profilePage}>
                                        Perfil
                                    </span>
                                    <span className="hover:cursor-pointer" onClick={friendsPage}>
                                        Amigos
                                    </span>
                                    <span className="hover:cursor-pointer" onClick={reviewsPage}>
                                        Reviews
                                    </span>
                                    <span className="hover:cursor-pointer" onClick={groupsPage}>
                                        Selecionar grupo
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
