"use client"
import { useAuth } from "@/app/context/auth-context"
import React from "react"

const GroupActions = ({ groupCreatorId }) => {
    //TODO: fazer a caixa de confirmação de sair/excluir grupo
    const { user } = useAuth()
    const groupCreator = () => {
        return (
            <button className="px-4 py-2 mt-4 bg-transparent border-2 border-danger text-white rounded-md shadow-md hover:bg-danger-900 transition-colors">
                Excluir grupo
            </button>
        )
    }

    const groupMember = () => {
        return (
            <button className="px-4 py-2 mt-4 bg-transparent border-2 border-danger text-danger rounded-md shadow-md hover:bg-danger-900 transition-colors">
                Sair do grupo
            </button>
        )
    }
    return <>{user.uid === groupCreatorId ? groupCreator() : groupMember()}</>
}

export default GroupActions
