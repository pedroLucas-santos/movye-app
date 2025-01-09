"use client"
import { useAuth } from "@/app/context/auth-context"
import React from "react"

const InviteUsers = ({ groupCreatorId }) => {
    const { user } = useAuth()
    return (
        <>
            {user?.uid === groupCreatorId && (
                <button className="invite-button px-4 py-2 mt-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                    Convidar Usuários
                </button>
            )}
        </>
    )
}

export default InviteUsers
