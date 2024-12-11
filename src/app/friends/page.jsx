"use client"
import React from "react"
import "../Header.css"
import { useAuth } from "../context/auth-context"
import LoadingSpinner from "../shared/LoadingSpinner"
import MustBeLogged from "../shared/MustBeLogged"
import NavBar from "../shared/NavBar"
import UserData from "../reviews/components/UserData"
import FriendsCard from "./components/FriendsCard"

const Friends = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <MustBeLogged />
    }

    return (
        <main id="view" className="w-full h-full scroll-smooth flex flex-col">
            <NavBar/>
            <div className="p-4 flex gap-4 h-full flex-grow overflow-y-hidden">
                <UserData/>
                <FriendsCard/>
            </div>
        </main>
    )
}

export default Friends
