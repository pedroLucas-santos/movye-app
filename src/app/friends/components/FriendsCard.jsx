import { useAuth } from "@/app/context/auth-context"
import ToastCustom from "@/app/dashboard/components/ToastCustom"
import { searchFriendCode, sendFriendRequest } from "@/app/lib/friendApi"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"

const FriendsCard = () => {
    const [inputCode, setInputCode] = useState("")
    const [friendData, setFriendData] = useState(null)
    const { user } = useAuth()

    const addFriend = async () => {
        try {
            await sendFriendRequest(user.uid, friendData.id)
            toast.success("Pedido de amizade enviado com sucesso!")
            setInputCode("")
            setFriendData(null)
        } catch (e) {
            toast.error(e.message || "Erro ao enviar a solicitação de amizade.");
            console.log(e)
        }
    }

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
    return (
        <div className="w-full h-full overflow-y-auto flex flex-col items-start justify-start bg-stone-950 rounded-lg shadow-2xl">
            <div className="grid grid-cols-2 w-full h-full gap-8">
                {/* Coluna Esquerda */}
                <div className="m-12 flex justify-start items-start flex-col gap-2">
                    <span className="text-xl">Código de amizade</span>
                    <div className="p-2 w-64 bg-white/20 flex justify-center items-center gap-12 rounded-lg">
                        <span type="text" className=" text-3xl">
                            7483746
                        </span>
                        <button className="bg-primary-dark text-white p-2 rounded-lg hover:bg-primary-dark/50 transition">Copiar</button>
                    </div>
                    <span className="opacity-40">Digite o codigo de amizade de quem você deseja adicionar</span>
                    <input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        type="text"
                        className="p-2 w-full rounded-lg border-2 bg-primary-dark border-primary-dark focus:outline-none focus:border-gray-200"
                    />
                    {inputCode !== '' && friendData && (
                        <div className="relative w-full bg-secondary-dark flex justify-start items-start p-2 rounded-lg">
                            {console.log(friendData)}
                            <div className="flex justify-center items-center gap-4">
                                <Image
                                    src={friendData.photoURL}
                                    alt="User's profile picture"
                                    width={100}
                                    height={100}
                                    quality={100}
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl">{friendData.displayName}</span>
                                    <span className="text-blue-400">
                                        <a href="">Perfil</a>
                                    </span>
                                </div>
                                <div className="absolute right-4">
                                    <button onClick={addFriend} className="bg-primary-dark text-white p-2 rounded-lg hover:bg-primary-dark/50 transition">
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
                    <div className="flex items-center justify-center w-72 p-4 bg-primary-dark rounded-lg">
                        <Image className="rounded-full" src={user.photoURL} alt={`'s profile picture`} width={50} height={50} quality={100} />
                        <div className="ml-4 flex-grow">
                            <h3 className="text-lg font-semibold text-white">{user.displayName}</h3>
                            <a className="text-sm text-blue-400">Perfil</a>
                        </div>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <ToastCustom/>
        </div>
    )
}

export default FriendsCard
