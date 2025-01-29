"use client"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import React from "react"

const InviteUsers = ({ groupCreatorId }) => {
    const { user } = useAuth()
     const router = useRouter()
        const inviteUsers = () => {
            router.push(`?invite=show`)
        }
    return (
        <>
            {user?.uid === groupCreatorId && (
                <button onClick={inviteUsers} className="invite-button px-4 py-2 mt-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                    Convidar Amigos
                </button>
            )}
        </>
    )
}

export default InviteUsers
