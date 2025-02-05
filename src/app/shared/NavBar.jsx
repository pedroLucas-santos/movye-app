"use client"
import React, { useEffect, useState } from "react"
import ModalAddMovie from "@/app/dashboard/[groupName]/components/ModalAddMovie"
import ModalReviewMovie from "@/app/dashboard/[groupName]/components/ModalReviewMovie"
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
import { useDisclosure } from "@heroui/modal"
import ProfileDropdown from "./components/ProfileDropdown"

const NavBar = ({ userFirestore }) => {
    const [isProfileDropdown, setProfileDropdown] = useState(false)
    const [isModalAddMovie, setModalAddMovie] = useState(false)
    const [isModalReviewMovie, setModalReviewMovie] = useState(false)
    const [isModalReviewEdit, setModalReviewEdit] = useState(false)
    const [isModalEditProfile, setModalEditProfile] = useState(false)
    const [isNotificationsDropdown, setIsNotificationsDropdown] = useState(false)

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const { notifications, loading } = useNotifications()
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { isSelectingReview, setIsSelectingReview, selectedReview } = useSelectionReview()
    const { selectedGroup, setSelectedGroup } = useGroup()

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
            setSelectedGroup(null)
            localStorage.removeItem("selectedGroup")
        } catch (err) {
            console.error(err)
        }
    }

    const reviewsPage = () => {
        router.push(`/reviews/${user?.uid}`)
    }

    const friendsPage = () => {
        router.push("/friends")
    }

    const profilePage = () => {
        router.push(`/profile/${user?.uid}`)
    }

    const groupsPage = () => {
        setSelectedGroup(null)
        localStorage.removeItem("selectedGroup") // Limpa o localStorage
        router.push(`/groups/${user?.uid}`)
    }

    const dashboardPage = () => {
        if (selectedGroup) {
            const sanitizedGroupName = selectedGroup.name.replace(/\s/g, "-") // Substituir espaços por "_"
            router.push(`/dashboard/${sanitizedGroupName}`)
        }
    }

    /* useEffect(() => {
        if (selectedGroup === null) {
            router.push(`/groups/${user?.uid}`)
        }
    }, [selectedGroup]) */

    return (
        <>
            {isModalReviewEdit && (
                <ModalReviewEdit
                    toggleModalReviewEdit={toggleModalReviewEdit}
                    isModalReviewEdit={isModalReviewEdit}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onOpenChange={onOpenChange}
                />
            )}

            {isModalEditProfile && (
                <ModalEditProfile
                    toggleModalEditProfile={toggleModalEditProfile}
                    isModalEditProfile={isModalEditProfile}
                    userFirestore={userFirestore}
                />
            )}

            <nav className="grid grid-cols-3 justify-items-center items-center h-32 w-full relative">
                <button id="menu-toggle" className="text-white md:hidden focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <div id="logo">
                    <span onClick={dashboardPage} className="font-bold text-3xl select-none hover:cursor-pointer text-white">
                        Movye
                    </span>
                </div>

                <div className="hidden md:block">
                    <ul className="hidden md:flex items-center justify-center">
                        <li>
                            {/* <Link href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Explorar
                            </Link> */}
                        </li>
                        <li>
                            {/* <Link href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Sugestões
                            </Link> */}
                        </li>
                        <li>
                           {/*  <Link href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                                Estatisticas
                            </Link> */}
                        </li>
                    </ul>
                </div>

                <div className="flex justify-center items-center gap-4">
                    {pathname.match(/\/dashboard(\/.*)?/) && (
                        <div className="gap-4 hidden md:flex">
                            <ModalReviewMovie/>

                            <ModalAddMovie/>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center items-center">
                        {pathname === `/reviews/${user?.uid}` && (
                            <button
                                onClick={() => setIsSelectingReview(!isSelectingReview)}
                                className="bg-zinc-100 text-black border-2 transition duration-150 hover:bg-zinc-500 p-2 rounded-md hidden md:inline-block"
                            >
                                Editar Review
                            </button>
                        )}
                        {pathname === `/profile/${user?.uid}` ? (
                            <ModalEditProfile/>
                        ) : null}
                        <div className="relative">
                            <ProfileDropdown user={user} />
                        </div>
                        <div className="relative text-white focus:outline-none">
                            <NotificationDropdown notifications={notifications}/>
                            {notifications.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-4 flex items-center justify-center rounded-full">
                                    {notifications > 9 ? "+9" : notifications.length}
                                </span>
                            )}
                        </div>
                        {}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar
