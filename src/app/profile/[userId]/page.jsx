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
import ProfileBackdrop from "./components/ProfileBackdrop"
import ProfileContent from "./components/ProfileContent"

export default async function ProfilePage({ params }) {
    const { userId } = await params

    // Fetch user data
    const user = await getUserById(userId)

    // Fetch friend list
    const friendList = await getFriendList(userId)
    const groupList = await getGroupsList(userId)

    if (!user) {
        return <div className="text-center text-red-500">User not found</div>
    }

    return (
        <>
            <div className="relative w-full h-screen bg-cover shadow-inner shadow-gray-900/80 overflow-x-hidden">
                {/* Imagem com gradiente no final */}
                <div className="absolute inset-0">
                    <ProfileBackdrop user={user} />

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
                </div>

                {/* Overlay escuro */}
                <div id="dark-filter" className="absolute inset-0 bg-black opacity-60"></div>

                <NavBar userFirestore={user} />

                {/* Conteúdo */}
                <div className="relative flex flex-col justify-center items-center w-full">
                    <div>
                        <UserInfo user={user} userId={userId} friendList={friendList} />
                        <FriendList friendList={friendList} userId={userId} />
                        <GroupListProfile groupList={groupList} userId={userId} />
                    </div>

                    <ProfileContent userId={userId} user={user}/>

                    <div className="flex flex-col justify-center items-center w-full mt-14 md:mt-0">
                        <h2 className="text-3xl text-white text-center">Últimas reviews:</h2>
                    </div>
                </div>

                {/* Div preta para testar a transição */}
                <div className="flex flex-col bg-black p-40 pt-0 pb-0">
                    <Suspense>
                        <div className="flex justify-end z-20">
                            <Link href={`/reviews/${userId}`} className="text-lg text-white text-center flex items-center">
                                Ver todas as reviews <FiArrowRight />
                            </Link>
                        </div>
                        <ReviewsCard userId={userId} limit={3} />
                    </Suspense>
                </div>
            </div>
        </>
    )
}
