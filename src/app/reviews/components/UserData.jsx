import { useState, useEffect } from "react"
import { fetchLastReviewUser } from "../../lib/movieApi" // Importando a função
import { useAuth } from "../../context/auth-context"
import Image from "next/image"
import RenderStars from "@/app/shared/RenderStars"

const UserData = () => {
    const { user, loading } = useAuth()
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        if (!user?.uid) return // Verifica se o user está disponível

        const fetchLastMovieReview = async () => {
            try {
                const response = await fetchLastReviewUser(user.uid) // Chama a função para pegar a última review
                setUserInfo(response) // Atualiza o estado com a resposta
            } catch (e) {
                console.error(e)
            }
        }

        fetchLastMovieReview() // Chama a função
    }, [user?.uid]) // A dependência é o `user?.uid`, para que a função seja chamada toda vez que o user mudar
    return (
        <div id="userInfo" className="flex border-2 border-cyan-100 flex-col w-96 justify-center items-center gap-4 p-4">
            <Image
                className="rounded-full"
                src={`${user.photoURL.replace("s96-c", "s400-c")}`}
                alt="User's profile picture"
                width={256}
                height={256}
                quality={100}
            />
            <div className="flex flex-col">
                <div className="items-center flex flex-col">
                    <span className="text-lg font-semibold">{user.displayName}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <div className="mt-4 flex flex-col justify-center items-center gap-4">
                        <span>Reviews: {userInfo.totalReviews}</span>
                        <div>
                            <span className="flex flex-col justify-center items-center">
                                Média de avaliação
                                <span className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <RenderStars key={index} index={index + 1} movieRating={userInfo.averageRating} />
                                    ))}
                                </span>
                            </span>
                        </div>
                        <div>
                            <span className="flex flex-col justify-center items-center">
                                Generos mais assistidos:
                                <span className="text-sm text-gray-500 bg-gray-950/20 rounded-lg  p-1">{userInfo.mostViewedGenre}</span>
                            </span>
                        </div>
                        <span>Última review:</span>
                        <div className="flex flex-col items-center p-8 shadow-inner shadow-gray-800/80 rounded-2xl bg-secondary-dark">
                            <div className="flex just">
                                <div className={`flex gap-4`}>
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            {userInfo?.id && <p className="font-semibold cursor-pointer text-center">{userInfo.id}</p>}
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
                            <div className={`italic mt-4 text-[18px] text-white font-normal`}>{userInfo.review}</div>
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
