import { useAuth } from "@/app/context/auth-context"
import ToastCustom from "@/app/dashboard/components/ToastCustom"
import { deleteFriend, getFriendList, getUserFriendCode, searchFriendCode, sendFriendRequest } from "@/app/lib/friendApi"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

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
                    console.log(e)
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
            console.log(e)
        }
    }

    const deleteFriendHandler = async (user, friendId) => {
        try {
            await deleteFriend(user, friendId)
            setFriendList((prevList) => prevList.filter((friend) => friend.id !== friendId))
            toast.success("Amigo excluído com sucesso!")
        } catch (e) {
            toast.error("Erro ao excluir amigo.")
            console.log(e)
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
            <div className="grid grid-cols-2 w-full h-full gap-8">
                {/* Coluna Esquerda */}
                <div className="m-12 flex justify-start items-start flex-col gap-2">
                    <span className="text-xl">Código de amizade</span>
                    <div className="p-4 w-72 h-14 bg-white/20 flex justify-between items-center gap-4 rounded-lg overflow-hidden">
                        <span className="text-3xl overflow-hidden text-ellipsis whitespace-nowrap">{userFriendCode}</span>
                        <button onClick={copyToClipboard} className="bg-primary-dark text-white p-2 rounded-lg hover:bg-primary-dark/50 transition">
                            Copiar
                        </button>
                    </div>
                    <span className="opacity-40">Digite o codigo de amizade de quem você deseja adicionar</span>
                    <input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        type="text"
                        className="p-2 w-full rounded-lg border-2 bg-primary-dark border-primary-dark focus:outline-none focus:border-gray-200"
                    />
                    {inputCode !== "" && friendData && (
                        <div className="relative w-full bg-secondary-dark flex justify-start items-start p-2 rounded-lg">
                            {console.log(friendData)}
                            <div className="flex justify-center items-center gap-4">
                                <Image src={friendData.photoURL} alt="User's profile picture" width={100} height={100} quality={100} />
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl">{friendData.displayName}</span>
                                    <span className="text-blue-400">
                                        <a href="">Perfil</a>
                                    </span>
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
                    <span className="text-3xl">Amigos</span>
                    {friendList?.length > 0 &&
                        friendList.map((friend) => (
                            <div key={friend.id} className="flex items-center justify-center w-72 p-4 bg-primary-dark rounded-lg">
                                <Image
                                    className="rounded-full"
                                    src={friend.photoURL}
                                    alt={`'s profile picture`}
                                    width={50}
                                    height={50}
                                    quality={100}
                                />
                                <div className="ml-4 flex-grow">
                                    <h3 className="text-lg font-semibold text-white">{friend.displayName}</h3>
                                    <a className="text-sm text-blue-400">Perfil</a>
                                </div>
                                <button onClick={() => toggleActionDropdown(friend.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                                    </svg>
                                </button>
                                {dropdownFriendId === friend.id && (
                                    <div ref={dropdownRef} className="absolute right-32 mt-2 bg-primary-dark rounded-lg shadow-lg w-32">
                                        <button
                                            onClick={() => deleteFriendHandler(user, friend.id)}
                                            className="w-full text-left text-red-600 p-2 hover:bg-red-600 hover:text-white rounded-lg"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
            <ToastCustom />
        </div>
    )
}

export default FriendsCard
