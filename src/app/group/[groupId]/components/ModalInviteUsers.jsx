"use client"
import { useAuth } from "@/app/context/auth-context"
import { getFriendList } from "@/app/lib/friendApi"
import { getGroupData, sendGroupRequest } from "@/app/lib/groupApi"
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import InviteUsers from "./InviteUsers"

const ModalInviteUsers = ({ groupCreatorId, groupId }) => {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const isInviting = searchParams.get("invite") || null
    const [isModalClosing, setIsModalClosing] = useState(null)
    const [notMembers, setNotMembers] = useState([])
    const router = useRouter()
    const modalFn = useDisclosure()

    useEffect(() => {
        const fetchNotMembers = async () => {
            try {
                const listF = await getFriendList(groupCreatorId)
                const listG = await getGroupData(groupId)
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

    const groupRequest = async (idUser) => {
        try {
            const group = await getGroupData(groupId)
            await sendGroupRequest(user, idUser, group)
            setIsModalClosing(true)
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <>
            <InviteUsers groupCreatorId={groupCreatorId} onOpen={modalFn.onOpen} />

            <Modal backdrop="blur" isOpen={modalFn.isOpen} onClose={modalFn.onClose} placement="top" classNames={
                {
                    base: 'bg-black',
                    closeButton: 'hover:bg-black active:bg-black'
                }
            }>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 justify-center">
                                <span className="text-2xl">Convidar Amigos</span>
                            </ModalHeader>
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
                                                <div className="w-60 flex items-center justify-between">
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
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalInviteUsers
