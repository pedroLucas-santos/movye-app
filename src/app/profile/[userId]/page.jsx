import { getFriendList } from "@/app/lib/friendApi"
import { getUserAvgReviews, getUserById, getUserReviews } from "@/app/lib/userApi"
import NavBar from "@/app/shared/NavBar"
import Image from "next/image"
import FriendList from "./components/FriendList"
import UserInfo from "./components/UserInfo"
import RenderStars from "@/app/shared/RenderStars"
import ReviewsCard from "@/app/reviews/[userId]/components/ReviewsCard"
import { Suspense } from "react"
import { FiArrowRight } from "react-icons/fi"
import Link from "next/link"
import { getGroupsList } from "@/app/lib/groupApi"
import GroupListProfile from "./components/GroupListProfile"

export default async function ProfilePage({ params }) {
    const { userId } = await params

    // Fetch user data
    const user = await getUserById(userId)
    const reviewCount = await getUserReviews(userId)
    const avgReview = await getUserAvgReviews(userId)

    // Fetch friend list
    const friendList = await getFriendList(userId)
    const groupList = await getGroupsList(userId)

    if (!user) {
        return <div className="text-center text-red-500">User not found</div>
    }

    const backdropUrl = `https://image.tmdb.org/t/p/original${user.favoriteMovie?.backdropPath}`

    return (
        <>
            <div className="relative w-full h-screen bg-cover shadow-inner shadow-gray-900/80 overflow-x-hidden">
                {/* Imagem com gradiente no final */}
                <div className="absolute inset-0">
                    <Suspense>
                        {user.favoriteMovie?.backdropPath !== "" || user.favoriteMovie?.backdropPath !== null && (
                            <Image src={backdropUrl} alt="Backdrop Image" fill quality={100} priority className="object-top object-cover" />
                        )}
                    </Suspense>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
                </div>

                {/* Overlay escuro */}
                <div id="dark-filter" className="absolute inset-0 bg-black opacity-60"></div>

                <NavBar userFirestore={user} />

                {/* Conteúdo */}
                <div className="relative flex flex-col justify-center items-center w-full">
                    <div>
                        <UserInfo user={user} reviewCount={reviewCount} />
                        <FriendList friendList={friendList} userId={userId} />
                        <GroupListProfile groupList={groupList} userId={userId} />
                    </div>

                    <div className="grid grid-cols-3 mt-24 p-4 rounded-xl justify-items-center h-32 content-center mb-12">
                        <div className="flex items-center flex-col h-full">
                            <h2 className="text-2xl">Reviews:</h2>
                            <span className="text-2xl">{reviewCount}</span>
                        </div>
                        <div className="flex items-center flex-col h-full">
                            <h2 className="text-2xl">Média de avaliação:</h2>
                            <span className="flex">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <RenderStars key={index} index={index + 1} movieRating={avgReview} />
                                ))}
                            </span>
                        </div>
                        <div className="flex items-center flex-col h-full">
                            <h2 className="text-2xl">Filme favorito:</h2>
                            <span className="text-2xl text-center text-wrap w-96">{user.favoriteMovie?.title}</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-full">
                        <h2 className="text-3xl text-white text-center">Últimas reviews:</h2>
                        <div className="w-[1300px] flex justify-end">
                            <Link href={`/reviews/${userId}`} className="text-lg text-white text-center flex items-center">
                                Ver todas as reviews <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Div preta para testar a transição */}

                <div className="w-full h-full bg-black">
                    <Suspense>
                        <ReviewsCard userId={userId} limit={3} />
                    </Suspense>
                </div>
            </div>
        </>
    )
}
