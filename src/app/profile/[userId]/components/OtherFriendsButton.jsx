"use client"
import { useRouter } from "next/navigation"
import React from "react"

const OtherFriendsButton = ({length}) => {
    const router = useRouter()
    const otherFriends = () => {
        router.push(`?otherfriends=show`)
    }
    return <button onClick={otherFriends} className="text-gray-400">+{length - 4} outros amigos</button>
}

export default OtherFriendsButton
