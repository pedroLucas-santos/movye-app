import ToastCustom from "@/app/dashboard/components/ToastCustom"
import { acceptFriendRequest } from "@/app/lib/friendApi"
import { updateNotificationStatus } from "@/app/lib/notificationApi"
import React, { useLayoutEffect, useState } from "react"
import { FiCheck, FiX } from "react-icons/fi"
import { toast } from "react-toastify"

const NotiFriendRequest = ({ notification }) => {
    const acceptFriend = async () => {
        try {
            await acceptFriendRequest(notification.senderId, notification.receiverId)
            await updateNotificationStatus(notification.id, "read")
        } catch (e) {
            toast.error(`Erro ao aceitar solicitação de amizade.\n ${e}`)
        }
    }

    const showToastAndAccept = () => {
        toast.success("Solicitação de amizade aceita!", {
            onClose: () => {
                // Executa a função acceptFriend após o toast ser fechado
                acceptFriend();
            },
        });
    };

    return (
        <div className="flex flex-col items-center px-4 py-2 border-2 border-primary-dark gap-1 rounded-xl">
            <div className="flex items-center gap-2">
                <img src={notification.senderPhoto} alt={`${notification.senderName} photo`} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex flex-col">
                    <div className="font-semibold text-sm text-white">{notification.title}</div>
                    <div className="text-xs text-white/70">{`${notification.senderName} ${notification.message}`}</div>
                </div>
            </div>

            <div className="flex gap-4 mt-2">
                <button
                    onClick={showToastAndAccept}
                    className="bg-transparent border-2 border-green-500 text-white rounded-full p-1 flex items-center gap-2 hover:bg-green-800 transition"
                >
                    <FiCheck className="w-5 h-5 text-green-500" />
                </button>
                <button className="bg-transparent border-2 border-red-500 text-white rounded-full p-1 flex items-center gap-2 hover:bg-red-800 transition">
                    <FiX className="w-5 h-5 text-red-500" />
                </button>
            </div>
            <ToastCustom/>
        </div>
    )
}

export default NotiFriendRequest
