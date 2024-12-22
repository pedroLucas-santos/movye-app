import { getUserAvgReviews, getUserById, getUserReviews } from "@/app/lib/userApi"
import ReviewsCard from "@/app/reviews/components/ReviewsCard"
import UserData from "@/app/reviews/components/UserData"
import NavBar from "@/app/shared/NavBar"
import React from "react"

const page = async ({ params }) => {
    const { userId } = params
    const user = await getUserById(userId)
    const reviewCount = await getUserReviews(userId)
    const avgReview = await getUserAvgReviews(userId)

    return (
        <main id="view" className="w-full h-full scroll-smooth flex flex-col">
            <NavBar />
            <div className="p-4 flex gap-4 h-full flex-grow overflow-y-hidden">
                <UserData userId={userId} actualUser={user}/>
                <ReviewsCard userId={userId}/>
            </div>
        </main>
    )
}

export default page
