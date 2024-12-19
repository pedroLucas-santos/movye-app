import React, { useEffect, useState } from "react"
import NotiFriendRequest from "./notificationTypes/NotiFriendRequest"
import NotiMessage from "./notificationTypes/NotiMessage"

const NotificationDropdown = ({ isNotificationsDropdown, notifications, loading }) => {
    if (!isNotificationsDropdown) return null

    return (
        <>
            {/* <div className="px-4 py-2 text-white text-sm">Sem novas notificações</div> DESCOMENTAR DEPOIS DE FAZER O LAYOUT E COLOCAR ISSO DEPOIS DO : (dois pontos)
                MUDAR TAMBÉM O === 0 PARA > 0*/}

            {/* FAZER O ENVIO DE NOTIFICAÇÃO NA SOLICITAÇÃO DE AMIZADE */}
            {isNotificationsDropdown && (
                <div
                    id="notificationsDropdown"
                    className="absolute top-24 right-[98px] w-64 h-96 bg-secondary-dark shadow-lg rounded-lg p-2 z-10 flex flex-col items-center justify-start"
                >
                    {/* Triângulo apontando para o sino */}
                    <div className="absolute -top-2 right-[50%] w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-secondary-dark"></div>

                    {notifications.length > 0 ? (
                        <div className="flex flex-col gap-4 h-full overflow-y-auto">
                            {notifications.map((notification, index) => {
                                switch (notification.type) {
                                    case "friend-request":
                                        return <NotiFriendRequest key={index} notification={notification} />
                                    case "message":
                                        return <NotiMessage key={index} notification={notification} />
                                }
                            })}
                        </div>
                    ) : (
                        <div className="px-4 py-2 text-white text-sm">Sem novas notificações</div>
                    )}
                </div>
            )}
        </>
    )
}

export default NotificationDropdown
