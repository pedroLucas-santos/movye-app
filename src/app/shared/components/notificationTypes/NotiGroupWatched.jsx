import { updateNotificationStatus } from "@/app/lib/notificationApi"
import Image from "next/image"
import React from "react"
import { FiTrash } from "react-icons/fi"
import { toast } from "react-toastify"

const NotiGroupWatched = ({ notification, toasty }) => {
    const formatMessage = (message) => {
        return message.split(/\*\*(.*?)\*\*/g).map((part, index) =>
            index % 2 === 1 ? (
                <strong className="text-white/80" key={index}>
                    {part}
                </strong>
            ) : (
                part
            )
        )
    }

    const readNoti = async () => {
        try {
            await updateNotificationStatus(notification.id, "read")
        } catch (err) {
            toast.error("Falha ao ler notificação.")
        }
    }
    return (
        <div className="relative flex flex-col items-center px-4 py-2 border-2 border-primary-dark gap-1 rounded-xl w-64 text-white overflow-hidden">
            {/* Imagem de fundo com Next.js */}
            <div className="absolute inset-0">
                <Image
                    src={`https://image.tmdb.org/t/p/original${notification.watchBackdropUrl}` || "/fallback.jpg"}
                    alt="Backdrop do filme"
                    fill
                    className="object-cover rounded-xl"
                />
            </div>

            {/* Overlay escurecido */}
            <div className="absolute inset-0 bg-black/80 rounded-xl"></div>

            <div className="relative flex items-center gap-2">
                <Image
                    src={notification.senderPhoto}
                    alt={`${notification.senderName} photo`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <div className="font-semibold text-sm text-center">{notification.title}</div>
                    <div className="text-xs text-white/70 text-center">
                        {formatMessage(notification.senderName)} {formatMessage(notification.message)}
                    </div>
                </div>
                <div>
                    <FiTrash onClick={readNoti} size={18} className="cursor-pointer hover:text-red-500 transition duration-200" />
                </div>
            </div>
        </div>
    )
}

export default NotiGroupWatched
