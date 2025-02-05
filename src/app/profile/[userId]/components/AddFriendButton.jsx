"use client"
import { useAuth } from "@/app/context/auth-context"
import { sendFriendRequest } from "@/app/lib/friendApi"
import React from "react"
import { toast } from "react-toastify"

const AddFriendButton = ({ userId, friendList }) => {
    const { user } = useAuth()

    const addFriend = async () => {
        try {
            await sendFriendRequest(user, userId)
            toast.success("Pedido de amizade enviado com sucesso!")
        } catch (err) {
            toast.error(err.toString())
        }
    }

    const isFriend = friendList.some((friend) => friend.id === user?.uid)
    return (
        <>
            {user?.uid !== userId && !isFriend && (
                <button
                    onClick={addFriend}
                    className="invite-button px-4 py-2 mt-4 bg-zinc-100 text-primary-dark rounded-md shadow-md hover:bg-zinc-300 transition"
                >
                    Adicionar Amigo
                </button>
            )}
        </>
    )
}

export default AddFriendButton
