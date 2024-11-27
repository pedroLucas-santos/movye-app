"use client"
import "../Header.css"
import { useAuth } from "../context/auth-context"
import LoadingSpinner from "../LoadingSpinner"
import NavBar from "../NavBar"
import MustBeLogged from "../MustBeLogged"
import UserData from "./components/UserData"
import ReviewsCard from "./components/ReviewsCard"
const Reviews = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <MustBeLogged />
    }

    //arrumar o scroll, nao permitir scrollar a pagina, somente os cards

    return (
        <main id="view" className="w-full h-full scroll-smooth overflow-y-auto">
            <NavBar />
            <div className="border-2 border-dashed border-red-600 p-4 flex gap-4 h-full">
                <UserData />
                <ReviewsCard/>
            </div>
        </main>
    )
}

export default Reviews
