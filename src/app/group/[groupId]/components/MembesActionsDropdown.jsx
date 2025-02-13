"use client"
import { useAuth } from "@/app/context/auth-context"
import { removeMemberFromGroup } from "@/app/lib/groupApi"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "react-toastify"

const MembesActionsDropdown = ({ groupCreatorId, groupId, memberId }) => {
    const { user } = useAuth()
    const router = useRouter()
    const removeMember = async () => {
        try {
            if(memberId === groupCreatorId) {
                toast.error('Você não pode se remover do grupo!')
                return;
            }
            await removeMemberFromGroup(groupId, memberId)
            toast.success('Membro removido!')
            setTimeout(() => {
                router.refresh()
            }, 1000)
        } catch (e) {
            console.error("Error removing member: ", e.message)
            toast.error('Erro ao remover membro.')
        }
    }
    return (
        <>
            {user?.uid === groupCreatorId && (
                <>
                    <Dropdown className="dark" shouldBlockScroll={false}>
                        <DropdownTrigger>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 cursor-pointer text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                            </svg>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Member action" onAction={removeMember}>
                            <DropdownItem key="remove" className="text-danger transition-colors" color="danger">
                                Remover
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </>
            )}
        </>
    )
}

export default MembesActionsDropdown
