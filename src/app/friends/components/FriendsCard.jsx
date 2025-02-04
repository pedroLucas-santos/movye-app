import { useAuth } from "@/app/context/auth-context"
import { deleteFriend, getFriendList, getUserFriendCode, searchFriendCode, sendFriendRequest } from "@/app/lib/friendApi"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import FriendsActionsDropdown from "./FriendsActionsDropdown"
import { FiClipboard } from "react-icons/fi"

const FriendsCard = () => {
    const [inputCode, setInputCode] = useState("")
    const [friendData, setFriendData] = useState(null)
    const [userFriendCode, setUserFriendCode] = useState(null)
    const [friendList, setFriendList] = useState(null)
    const [dropdownFriendId, setDropdownFriendId] = useState(null)
    const { user } = useAuth()

    const dropdownRef = useRef(null)

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserFriendCode()
            fetchFriendList()
        }
    }, [user])

    useEffect(() => {
        if (inputCode !== "") {
            const friendCode = async () => {
                try {
                    const response = await searchFriendCode(inputCode)
                    setFriendData(response)
                } catch (e) {
                    
                }
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
            toast.success("Pedido de amizade enviado com sucesso!")
            setInputCode("")
            setFriendData(null)
        } catch (e) {
            toast.error(e.message || "Erro ao enviar a solicitação de amizade.")
            
        }
    }

    const deleteFriendHandler = async (user, friendId) => {
        try {
            await deleteFriend(user, friendId)
            setFriendList((prevList) => prevList.filter((friend) => friend.id !== friendId))
            toast.success("Amigo excluído com sucesso!")
        } catch (e) {
            toast.error("Erro ao excluir amigo.")
            
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(userFriendCode) // Copia o userFriendCode para o clipboard
            .then(() => {
                toast.info("Código copiado com sucesso!") // Alerta ou mensagem de sucesso após copiar
            })
            .catch((error) => {
                console.error("Erro ao copiar: ", error) // Tratamento de erro, caso algo dê errado
            })
    }

    const fetchUserFriendCode = async () => {
        try {
            setUserFriendCode(await getUserFriendCode(user.uid))
        } catch (e) {
            console.error(e)
        }
    }

    const fetchFriendList = async () => {
        try {
            setFriendList(await getFriendList(user.uid))
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="w-full h-full overflow-y-auto flex flex-col items-start justify-start bg-stone-950 rounded-lg shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8">
                {/* Coluna Esquerda */}
                <div className="m-12 flex justify-start items-start flex-col gap-2">
                    <span className="text-xl text-white">Código de amizade</span>
                    <div className="p-4 w-72 h-14 bg-white/20 flex justify-between items-center gap-4 rounded-lg overflow-hidden">
                        <span className="text-xl overflow-hidden text-ellipsis whitespace-nowrap text-white">{userFriendCode}</span>
                        <button onClick={copyToClipboard} className="bg-primary-dark text-white p-2 rounded-lg hover:bg-primary-dark/50 transition flex items-center gap-2 justify-center">
                            {<FiClipboard/>}Copiar
                        </button>
                    </div>
                    <span className="opacity-40 text-white">Digite o codigo de amizade de quem você deseja adicionar</span>
                    <input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        type="text"
                        className="p-2 w-full rounded-lg border-2 bg-primary-dark border-primary-dark focus:outline-none focus:border-gray-200 text-white"
                    />
                    {inputCode !== "" && friendData && (
                        <div className="relative w-full bg-secondary-dark flex justify-start items-start p-2 rounded-lg">
                            {}
                            <div className="flex justify-center items-center gap-4 flex-col md:flex-row">
                                <Image src={friendData.photoURL} className="select-none" alt="User's profile picture" width={100} height={100} quality={100} />
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

                {/* Coluna Direita */}
                <div id="friendList" className="flex items-center p-4 rounded-lg flex-col gap-4 justify-start self-start h-full overflow-y-auto">
                    <span className="text-3xl text-white">Amigos</span>
                    {friendList?.length > 0 &&
                        friendList.map((friend) => (
                            <div key={friend.id} className="flex items-center justify-center w-72 p-4 bg-primary-dark rounded-lg">
                                <Image
                                    className="rounded-full select-none"
                                    src={friend.photoURL}
                                    alt={`'s profile picture`}
                                    width={50}
                                    height={50}
                                    quality={100}
                                />
                                <div className="ml-4 flex-grow">
                                    <h3 className="text-lg font-semibold text-white">{friend.displayName}</h3>
                                    <Link href={`/profile/${friend.id}`} className="text-sm text-blue-400">
                                        Perfil
                                    </Link>
                                </div>
                                <FriendsActionsDropdown user={user} friendId={friend.id} deleteFriendHandler={deleteFriendHandler}/>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default FriendsCard
