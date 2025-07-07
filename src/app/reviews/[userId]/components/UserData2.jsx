import { useAuth } from '@/app/context/auth-context'
import { useContentType } from '@/app/context/contentTypeProvider'
import { useMovieUpdate } from '@/app/context/movieUpdateProvider'
import { getUserFriendCode } from '@/app/lib/friendApi'
import { fetchLastReviewUser } from '@/app/lib/movieApi'
import RenderStars from '@/app/shared/RenderStars'
import { Tooltip } from '@heroui/tooltip'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FiClipboard } from 'react-icons/fi'
import { toast } from 'react-toastify'

const UserData2 = ({ userId, actualUser }) => {
    const { user, loading } = useAuth()
    const [userInfo, setUserInfo] = useState({})
    const { triggerUpdate, updateSignal } = useMovieUpdate()
    const { contentType } = useContentType()
    const [userFriendCode, setUserFriendCode] = useState(null)

    const fetchUserFriendCode = async () => {
        try {
            setUserFriendCode(await getUserFriendCode(user.uid))
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (!user?.uid) return 

        let userIdToUse

        if (userId) {
            userIdToUse = user.uid === userId ? user.uid : userId
        } else {
            userIdToUse = user.uid
        }

        const fetchLastMovieReview = async () => {
            try {
                const response = await fetchLastReviewUser(userIdToUse, contentType) 
                setUserInfo(response) 
            } catch (e) {
                console.error(e)
            }
        }

        fetchUserFriendCode()

        fetchLastMovieReview() 
    }, [user?.uid, updateSignal, contentType]) 

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(userFriendCode) 
            .then(() => {
                toast.info('Código copiado com sucesso!') 
            })
            .catch((error) => {
                console.error('Erro ao copiar: ', error) 
            })
    }
    return (
        <div className="border-yellow-200 border-2 w-full h-56 flex justify-center items-center">
            <div className="flex items-top justify-center gap-12 border-2" id="userData">
                <div className="flex gap-2">
                    <Image src={actualUser.photoURL} width={100} height={100} alt="User Image" className="rounded-full" quality={100} />
                    <div className="flex flex-col justify-center gap-1">
                        <div className="flex gap-2 justify-center items-center">
                            <span className="text-2xl text-white font-bold">{actualUser.displayName}</span>
                            <Tooltip content="Copiar código de amizade" className="text-white" closeDelay={60}>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-primary-dark text-white p-1 rounded-lg hover:bg-black transition flex items-center gap-2 justify-center"
                                >
                                    {<FiClipboard />}
                                    {userFriendCode}
                                </button>
                            </Tooltip>
                        </div>
                        <div>
                            <span className="flex flex-col justify-center text-white">
                                <span className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <RenderStars key={index} index={index + 1} movieRating={userInfo.averageRating} />
                                    ))}
                                </span>
                                <span className="text-sm break-words">Média de avaliação</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <span className="flex flex-col justify-center items-center text-white">
                        Generos mais assistidos:
                        <span className="text-sm text-white bg-gray-950/20 rounded-lg p-1">{userInfo.mostViewedGenre}</span>
                    </span>
                </div>
                <span className="text-white text-center">
                    Última review: <br />
                    <Link href={`/reviews/${actualUser.id}`} className="hover:underline transition-all duration-100">
                        {userInfo.id}
                    </Link>
                </span>
                <span className="text-white">Reviews: {userInfo.totalReviews}</span>
            </div>
        </div>
    )
}

export default UserData2
