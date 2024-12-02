"use client"
import "../Header.css"
import { useAuth } from "../context/auth-context"
import LoadingSpinner from "../shared/LoadingSpinner"
import NavBar from "../shared/NavBar"
import MustBeLogged from "../shared/MustBeLogged"
import UserData from "./components/UserData"
import ReviewsCard from "./components/ReviewsCard"
import { SelectionProvider } from "../context/selectionEditReview"

const Reviews = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <MustBeLogged />
    }

    return (
            <main id="view" className="w-full h-full scroll-smooth flex flex-col">
                <NavBar />
                <div className="p-4 flex gap-4 h-full flex-grow overflow-y-hidden">
                    <UserData />
                    <ReviewsCard />
                </div>
            </main>
    )
}

export default Reviews
