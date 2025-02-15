"use client"
import React from "react"
import "../Header.css"
import { useAuth } from "../context/auth-context"
import LoadingSpinner from "../shared/LoadingSpinner"
import MustBeLogged from "../shared/MustBeLogged"
import NavBar from "../shared/NavBar"
import UserData from "../reviews/[userId]/components/UserData"
import FriendsCard from "./components/FriendsCard"

const Friends = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    //TODO: arrumar as cores dos textos/fundos

    if (!user) {
        return <MustBeLogged />
    }

    return (
        <div id="view" className="w-full h-full scroll-smooth flex flex-col">
            <NavBar/>
            <div className="p-4 flex gap-4 h-full flex-grow overflow-y-auto md:overflow-y-hidden">
                <div className="md:hidden"><FriendsCard/></div>
                <div className="hidden md:flex flex-grow gap-4">
                    <UserData actualUser={user}/>
                    <FriendsCard/>
                </div>
            </div>
        </div>
    )
}

export default Friends
