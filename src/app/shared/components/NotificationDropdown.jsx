import React, { useEffect, useState } from "react"
import NotiFriendRequest from "./notificationTypes/NotiFriendRequest"
import NotiMessage from "./notificationTypes/NotiMessage"

const NotificationDropdown = ({ isNotificationsDropdown }) => {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        setNotifications([
            {
                type: "friend-request",
                title: "Solicitação de Amizade",
                user: "blxck",
                photoURL: "https://lh3.googleusercontent.com/a/ACg8ocL5lwkXQbEAwqEp7_z8OHGk-Ex0xVq-SCPmqf0Q0NL8xTWWgALo=s96-c",
                message: "enviou uma solicitação de amizade!",
                friendRequestID: "f9xlk",
                createdAt: "2015-02-16",
            },

            {
                type: "message",
                title: "Nova Mensagem!",
            },
        ])
    }, [])

    return (
        <>
            {/* <div className="px-4 py-2 text-white text-sm">Sem novas notificações</div> DESCOMENTAR DEPOIS DE FAZER O LAYOUT E COLOCAR ISSO DEPOIS DO : (dois pontos)
                MUDAR TAMBÉM O === 0 PARA > 0*/}

            {/* FAZER O ENVIO DE NOTIFICAÇÃO NA SOLICITAÇÃO DE AMIZADE */}
            {isNotificationsDropdown && (
                <div
                    id="notificationsDropdown"
                    className="absolute top-24 right-8 w-64 h-96 bg-secondary-dark shadow-lg rounded-lg p-2 z-10 flex flex-col items-center justify-start overflow-y-auto"
                >
                    {/* Triângulo apontando para o sino */}
                    <div className="absolute -top-2 right-[50%] w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-secondary-dark"></div>

                    {notifications.length === 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className="flex flex-col px-4 py-2 border-b border-gray-200 last:border-b-0">
                                <div className="font-semibold text-sm text-white">{notification.title}</div>
                                <div className="text-xs text-white">{notification.message}</div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col gap-4">
                            {notifications.map((notification, index) => {
                                switch (notification.type) {
                                    case "friend-request":
                                        return <NotiFriendRequest key={index} notification={notification} />
                                    case "message":
                                        return <NotiMessage key={index} notification={notification} />
                                    // Adicione outros tipos de notificação conforme necessário
                                    // Adicione outros tipos de notificação conforme necessário
                                    default:
                                        return (
                                            <div key={index} className="p-4 bg-gray-200 rounded-lg">
                                                <p>Notificação desconhecida</p>
                                            </div>
                                        )
                                }
                            })}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default NotificationDropdown
