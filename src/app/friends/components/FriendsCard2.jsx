import { useAuth } from '@/app/context/auth-context'
import { deleteFriend, getFriendList, getUserFriendCode, searchFriendCode, sendFriendRequest } from '@/app/lib/friendApi'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import FriendsActionsDropdown from './FriendsActionsDropdown'
import { FiClipboard } from 'react-icons/fi'
import RenderStars from '@/app/shared/RenderStars'
import { fetchLastReviewUser } from '@/app/lib/movieApi'
import { useContentType } from '@/app/context/contentTypeProvider'

const FriendsCard2 = () => {
    const [inputCode, setInputCode] = useState('')
    const [friendData, setFriendData] = useState(null)
    const [userFriendCode, setUserFriendCode] = useState(null)
    const [friendList, setFriendList] = useState(null)
    const [dropdownFriendId, setDropdownFriendId] = useState(null)
    const { user } = useAuth()
    const { contentType } = useContentType()

    const dropdownRef = useRef(null)

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserFriendCode()
        }
    }, [user])

    useEffect(() => {
        if (inputCode !== '') {
            const friendCode = async () => {
                try {
                    const response = await searchFriendCode(inputCode)
                    setFriendData(response)
                } catch (e) {}
            }
            friendCode()
        }
    }, [inputCode])

    const toggleActionDropdown = (id) => {
        setDropdownFriendId((prevId) => (prevId === id ? null : id))
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownFriendId(null) // Close dropdown if click is outside
        }
    }

    const addFriend = async () => {
        try {
            await sendFriendRequest(user, friendData.id)
            toast.success('Pedido de amizade enviado com sucesso!')
            setInputCode('')
            setFriendData(null)
        } catch (e) {
            toast.error(e.message || 'Erro ao enviar a solicitação de amizade.')
        }
    }

    const deleteFriendHandler = async (user, friendId) => {
        try {
            await deleteFriend(user, friendId)
            setFriendList((prevList) => prevList.filter((friend) => friend.id !== friendId))
            toast.success('Amigo excluído com sucesso!')
        } catch (e) {
            toast.error('Erro ao excluir amigo.')
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(userFriendCode) // Copia o userFriendCode para o clipboard
            .then(() => {
                toast.info('Código copiado com sucesso!') // Alerta ou mensagem de sucesso após copiar
            })
            .catch((error) => {
                console.error('Erro ao copiar: ', error) // Tratamento de erro, caso algo dê errado
            })
    }

    const fetchUserFriendCode = async () => {
        try {
            setUserFriendCode(await getUserFriendCode(user.uid))
        } catch (e) {
            console.error(e)
        }
    }

    //FIXME arrumar isso ai embaixo

    useEffect(() => {
        const fetchFriendList = async () => {
            try {
                setFriendList(await getFriendList(user?.uid, contentType))
            } catch (e) {
                console.error(e)
            }
        }
        fetchFriendList()
    }, [user, contentType])

    return (
        <div className="w-full h-full overflow-y-auto flex items-start justify-start rounded-lg shadow-2xl">
            <div className="w-3/4 h-full flex flex-wrap justify-center items-start pt-12 gap-14 p-4">
                {friendList?.length > 0 &&
                    friendList.map((friend) => (
                        <div
                            key={friend.id}
                            className="w-[525px] h-52 border-secondary-dark bg-primary-dark rounded-xl shadow-lg overflow-hidden relative border-2"
                        >
                            <div
                                className="absolute inset-0 z-0"
                                style={{
                                    backgroundImage: `url(https://image.tmdb.org/t/p/w780${friend.backdropPath})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'blur(1px) brightness(0.34)'
                                }}
                            ></div>

                            <div className="absolute bottom-0 left-0 w-full px-4 pt-12 pb-3 z-20 flex flex-col items-center">
                                <Link href={`/profile/${friend.id}`}>
                                    <h2 className="text-lg font-semibold text-gray-200 text-center">{friend.displayName}</h2>
                                </Link>
                                <div className="flex flex-col justify-center text-white gap-1 items-center">
                                    <div className="flex">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <RenderStars key={index} index={index + 1} movieRating={friend.averageRating} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-300">Média de avaliação</span>
                                </div>
                            </div>

                            <div className="absolute left-1/2 -translate-x-1/2 bottom-[90px] z-30">
                                <Link href={`/profile/${friend.id}`}>
                                    <Image
                                        src={friend.photoURL}
                                        width={80}
                                        height={80}
                                        quality={100}
                                        alt="Foto do amigo"
                                        className="w-20 h-20 rounded-full border-4 border-secondary-dark shadow-md"
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>

            <div className="flex-1 h-full p-12">
                <span className="opacity-40 text-white">Digite o codigo de amizade de quem você deseja adicionar</span>
                <input
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    type="text"
                    className="p-2 mt-2 w-full rounded-lg border-2 bg-secondary-dark border-secondary-dark focus:outline-none focus:border-gray-200 text-white"
                />
                {inputCode !== '' && friendData && (
                    <div className="relative w-full bg-secondary-dark flex justify-start items-start p-2 rounded-lg mt-4">
                        {}
                        <div className="flex justify-center items-center gap-4 flex-col md:flex-row">
                            <Image
                                src={friendData.photoURL}
                                className="select-none"
                                alt="User's profile picture"
                                width={100}
                                height={100}
                                quality={100}
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-white">{friendData.displayName}</span>
                                <Link href={`/profile/${friendData.id}`} className="text-sm text-blue-400">
                                    Perfil
                                </Link>
                            </div>
                            <div className="absolute right-4">
                                <button onClick={addFriend} className="bg-primary-dark text-white p-2 rounded-lg hover:bg-stone-900 transition">
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FriendsCard2
