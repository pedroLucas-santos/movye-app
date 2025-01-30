"use client"
import { useAuth } from "@/app/context/auth-context"
import { getFriendList } from "@/app/lib/friendApi"
import { getGroupData, sendGroupRequest } from "@/app/lib/groupApi"
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"

const ModalInviteUsers = ({ groupCreatorId, groupId }) => {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const isInviting = searchParams.get("invite") || null
    const [isModalClosing, setIsModalClosing] = useState(null)
    const [notMembers, setNotMembers] = useState([])
    const router = useRouter()
    const [group, setGroup] = useState(null)
    const [isValidMember, setIsValidMember] = useState(null)

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    useEffect(() => {
        const fetchNotMembers = async () => {
            try {
                const listF = await getFriendList(groupCreatorId)
                const listG = await getGroupData(groupId)
                setGroup(listG)
                const memberIds = listG.members.map((member) => member.id)

                // Filtra a lista de amigos para excluir aqueles que estão em memberIds
                const filteredList = listF.filter((friend) => !memberIds.includes(friend.id))
                setNotMembers(filteredList)
            } catch (e) {
                console.error(e)
            }
        }
        fetchNotMembers()
    }, [])

    useEffect(() => {
        const verifyMember = () => {
            try{
                const memberList = group?.members.map((member) => member.id)
                if(memberList?.includes(user.uid)){
                    setIsValidMember(true)
                }else {
                    setIsValidMember(false)
                }
            }catch(e){
                console.error(e.toString())
            }
        }
        verifyMember()
    }, [group])

    const groupRequest = async (idUser) => {
        try {
            const group = await getGroupData(groupId)
            await sendGroupRequest(user, idUser, group)
            toast.success("Usuário convidado!")
        } catch (e) {
            toast.error(e.toString())
        }
    }
    
    return (
        <>
            {isValidMember && (
                <>
                    <button
                        onClick={onOpen}
                        className="invite-button px-4 py-2 mt-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
                    >
                        Convidar Amigos
                    </button>
                    <Modal className="dark" placement="top" scrollBehavior="inside" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            <ModalHeader className="flex flex-col gap-1 justify-center items-center text-2xl">Convidar Amigos</ModalHeader>
                            <ModalBody>
                                <div className="flex justify-center items-center">
                                    <ul className="pl-4 mt-4">
                                        {notMembers.map((nMember) => (
                                            <li key={nMember.id} className="text-sm  flex items-center gap-4">
                                                <div className="flex-shrink-0 w-16 h-16 mb-3">
                                                    <Link href={`/profile/${nMember.id}`}>
                                                        <Image
                                                            src={nMember.photoURL === null ? null : nMember.photoURL}
                                                            alt={`${nMember.displayName}'s profile picture`}
                                                            className="rounded-full w-full h-full"
                                                            width={500}
                                                            height={500}
                                                            quality={100}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="w-60 flex items-center justify-between gap-4">
                                                    <Link href={`/profile/${nMember.id}`}>
                                                        <span className="truncate">{nMember.displayName}</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            groupRequest(nMember.id)
                                                        }}
                                                        className="text-white bg-secondary-dark px-4 py-2 text-center rounded-md hover:bg-zinc-900 transition-colors"
                                                    >
                                                        Convidar
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    )
}

export default ModalInviteUsers
