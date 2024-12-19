import { getFriendList } from "@/app/lib/friendApi"
import { getUserAvgReviews, getUserById, getUserReviews } from "@/app/lib/userApi"
import NavBar from "@/app/shared/NavBar"
import Image from "next/image"
import FriendList from "./components/FriendList"
import UserInfo from "./components/UserInfo"
import RenderStars from "@/app/shared/RenderStars"

export default async function ProfilePage({ params }) {
    const { userId } = await params

    // Fetch user data
    const user = await getUserById(userId)
    const reviewCount = await getUserReviews(userId)
    const avgReview = await getUserAvgReviews(userId)

    // Fetch friend list
    const friendList = await getFriendList(userId)

    if (!user) {
        return <div className="text-center text-red-500">User not found</div>
    }

    const backdropUrl = `https://image.tmdb.org/t/p/original${user.favoriteMovie?.backdropPath}`

    return (
        <>
            <div className={`relative w-full h-screen bg-cover shadow-inner shadow-gray-900/80 overflow-y-hidden`}>
                <Image
                    src={backdropUrl ? backdropUrl : null}
                    alt="Backdrop Image"
                    fill // Ensures the image covers the div
                    quality={100} // Ensures the best quality
                    priority // Preloads the image for faster rendering
                    className="object-center object-cover"
                />
                <div id="dark-filter" className="absolute inset-0 bg-black opacity-60"></div>
                <NavBar />
                <div className="relative flex flex-col justify-center items-center w-full h-[590px]">
                    <div>
                        <UserInfo user={user} reviewCount={reviewCount} />
                        <FriendList friendList={friendList} />
                    </div>
                    <div className="grid grid-cols-3 mt-24 bg-black/80 p-4 rounded-xl justify-items-center h-32 content-center">
                        <div className="flex items-center flex-col h-full">
                            <h2 className="text-2xl">Reviews: </h2>
                            <span className="text-2xl">{reviewCount}</span>
                        </div>
                        <div className="flex items-center flex-col h-full">
                            <h2 className="text-2xl">Média de avaliação: </h2>
                            <span className="flex">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <RenderStars key={index} index={index + 1} movieRating={avgReview} />
                                ))}
                            </span>
                        </div>
                        <div className="flex items-center flex-col h-full">
                            <h2 className="text-2xl">Filme favorito: </h2>
                            <span className="text-2xl text-center text-wrap w-96">{user.favoriteMovie?.title}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
