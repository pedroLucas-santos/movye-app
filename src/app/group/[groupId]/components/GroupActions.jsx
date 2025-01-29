"use client"
import { useAuth } from "@/app/context/auth-context"
import { useGroup } from "@/app/context/groupProvider"
import { deleteGroup, removeMemberFromGroup } from "@/app/lib/groupApi"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/drawer"
import { useDisclosure } from "@heroui/modal"
import { Tooltip } from "@heroui/tooltip"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "react-toastify"

const GroupActions = ({ groupCreatorId, groupId, groupName, groupMembers }) => {
    //TODO: fazer a caixa de confirmação de sair/excluir grupo
    const { user } = useAuth()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const router = useRouter()
    const {setSelectedGroup} = useGroup()

    const leaveGroup = async () => {
        try {
            await removeMemberFromGroup(groupId, user?.uid)
            toast.success(`Você saiu do grupo ${groupName}`, {
                onClose: () => router.refresh(),
            })
        } catch (err) {
            toast.error(err.toString())
        }
    }
    const groupDelete = async () => {
        try {
            await deleteGroup(user.uid, groupId)
            toast.success(`Você excluiu o grupo ${groupName}`, {
                onClose: () => {
                    router.push(`/groups/${user?.uid}`)
                    setSelectedGroup(null)
                }
            })
        } catch (err) {
            toast.error(err.toString())
        }
    }

    const groupRoleValidation = () => {
        if (user?.uid === groupCreatorId) {
            return groupCreator()
        } else if (groupMembers.some((member) => member.id === user?.uid)) {
            return groupMember()
        }

        return null
    }

    const groupCreator = () => {
        return (
            <>
                <button
                    onClick={onOpen}
                    className="px-4 py-2 mt-4 bg-transparent border-2 border-danger text-danger rounded-md shadow-md hover:bg-danger-900 transition-colors"
                >
                    Excluir grupo
                </button>
                <Drawer
                    className="dark"
                    placement="bottom"
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                >
                    <DrawerContent>
                        {(onClose) => (
                            <>
                                <DrawerHeader className="flex flex-col gap-1 items-center">Excluir grupo</DrawerHeader>
                                <DrawerBody className="justify-center items-center">
                                    <p>Tem certeza que deseja excluir o grupo {groupName} ?</p>
                                </DrawerBody>
                                <DrawerFooter className="justify-center">
                                    <Tooltip content="Essa ação é irreversível!" color="danger" closeDelay={100}>
                                        <button
                                            className="px-4 py-2 mt-4 bg-transparent border-2 border-danger text-danger rounded-md shadow-md hover:bg-danger-100 transition-colors"
                                            onClick={() => {
                                                groupDelete()
                                                onClose()
                                            }}
                                        >
                                            Sim
                                        </button>
                                    </Tooltip>
                                    <button
                                        className="px-4 py-2 mt-4 bg-transparent border-2 border-secondary-dark text-secondary-dark rounded-md shadow-md hover:bg-zinc-400 transition-colors"
                                        onClick={onClose}
                                    >
                                        Não
                                    </button>
                                </DrawerFooter>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            </>
        )
    }

    const groupMember = () => {
        return (
            <>
                <button
                    onClick={onOpen}
                    className="px-4 py-2 mt-4 bg-transparent border-2 border-danger text-danger rounded-md shadow-md hover:bg-danger-900 transition-colors"
                >
                    Sair do grupo
                </button>
                <Drawer
                    className="dark"
                    placement="bottom"
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                >
                    <DrawerContent>
                        {(onClose) => (
                            <>
                                <DrawerHeader className="flex flex-col gap-1 items-center">Sair do grupo</DrawerHeader>
                                <DrawerBody className="items-center">
                                    <p>Tem certeza que deseja sair do grupo {groupName} ?</p>
                                </DrawerBody>
                                <DrawerFooter className="justify-center">
                                    <button
                                        className="px-4 py-2 mt-4 bg-transparent border-2 border-danger text-danger rounded-md shadow-md hover:bg-danger-100 transition-colors"
                                        onClick={() => {
                                            leaveGroup()
                                            onClose()
                                        }}
                                    >
                                        Sim
                                    </button>
                                    <button
                                        className="px-4 py-2 mt-4 bg-transparent border-2 border-secondary-dark text-secondary-dark rounded-md shadow-md hover:bg-zinc-400 transition-colors"
                                        onClick={onClose}
                                    >
                                        Não
                                    </button>
                                </DrawerFooter>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            </>
        )
    }
    return <>{groupRoleValidation()}</>
}

export default GroupActions
