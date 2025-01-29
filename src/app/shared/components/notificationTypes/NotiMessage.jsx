import React from "react"

const NotiMessage = ({notification}) => {
    return (
        <div className="flex flex-col items-center px-4 py-2 border-2 border-primary-dark gap-1 rounded-xl w-64">
            <div className="font-semibold text-sm text-white">{notification.title}</div>
            <div className="text-xs text-white">
                <span className="font-semibold">{notification.user}:</span> {notification.message}
            </div>
        </div>
    )
}

export default NotiMessage
