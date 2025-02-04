"use client"
import { useState, useEffect } from "react"
import { fetchLastReviewUser } from "../../../lib/movieApi" // Importando a função
import { useAuth } from "../../../context/auth-context"
import Image from "next/image"
import RenderStars from "@/app/shared/RenderStars"
import { useMovieUpdate } from "../../../context/movieUpdateProvider"

const UserData = ({userId, actualUser}) => {
    const { user, loading } = useAuth()
    const [userInfo, setUserInfo] = useState({})
    const { triggerUpdate, updateSignal } = useMovieUpdate()

    useEffect(() => {
        if (!user?.uid) return // Verifica se o user está disponível

        let userIdToUse

        if (userId) {
            userIdToUse = user.uid === userId ? user.uid : userId
        } else {
            userIdToUse = user.uid
        }

        const fetchLastMovieReview = async () => {
            try {
                const response = await fetchLastReviewUser(userIdToUse) // Chama a função para pegar a última review
                setUserInfo(response) // Atualiza o estado com a resposta
            } catch (e) {
                console.error(e)
            }
        }

        fetchLastMovieReview() // Chama a função
    }, [user?.uid, updateSignal]) // A dependência é o `user?.uid`, para que a função seja chamada toda vez que o user mudar
    return (
        <div id="userInfo" className="flex flex-col w-96 justify-center items-center gap-4 p-28">
            <Image
                className="rounded-full"
                src={`${actualUser.photoURL.replace("s96-c", "s400-c")}`}
                alt="User's profile picture"
                width={256}
                height={256}
                quality={100}
            />
            <div className="flex flex-col">
                <div className="items-center flex flex-col">
                    <span className="text-lg font-semibold text-white">{actualUser.displayName}</span>
                    <div className="mt-4 flex flex-col justify-center items-center gap-4">
                        <span className="text-white">Reviews: {userInfo.totalReviews}</span>
                        <div>
                            <span className="flex flex-col justify-center items-center text-white">
                                Média de avaliação
                                <span className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <RenderStars key={index} index={index + 1} movieRating={userInfo.averageRating} />
                                    ))}
                                </span>
                            </span>
                        </div>
                        <div>
                            <span className="flex flex-col justify-center items-center text-white">
                                Generos mais assistidos:
                                <span className="text-sm text-white bg-gray-950/20 rounded-lg p-1">{userInfo.mostViewedGenre}</span>
                            </span>
                        </div>
                        <span className="text-white">Última review:</span>
                        <div className="flex flex-col items-center p-8 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark overflow-y-auto">
                            <div className="flex just">
                                <div className={`flex gap-4`}>
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            {userInfo?.id && <p className="font-semibold text-center text-white">{userInfo.id}</p>}
                                        </div>
                                        {userInfo.rating && (
                                            <div className="text-[#005ef6] text-xl tracking-[2px] flex justify-center mt-4">
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <RenderStars key={index} index={index + 1} movieRating={userInfo.rating} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={`italic mt-4 text-[18px] text-white font-normal truncate w-80 text-center`}>{userInfo.review}</div>
                            <div className={`flex gap-1 text-white text-[12px] mt-4 flex-col`}>
                                <span>{userInfo.reviewed_at}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserData
