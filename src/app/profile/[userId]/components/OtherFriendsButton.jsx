"use client"
import { getFriendList } from "@/app/lib/friendApi"
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal"
import Image from "next/image"
import Link from "next/link"
import React, { useLayoutEffect, useState } from "react"

const OtherFriendsButton = ({ length, userId }) => {
    const [friendList, setFriendList] = useState([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    useLayoutEffect(() => {
        const fetchFriendList = async () => {
            try {
                const response = await getFriendList(userId)
                setFriendList(response)
            } catch (e) {
                console.error("Error fetching friend list", e)
            }
        }
        fetchFriendList()
    }, [])
    return (
        <>
            <button onClick={onOpen} className="hover:underline">
                +{length - 4} outros amigos
            </button>
            <Modal className="dark" placement="top" scrollBehavior="inside" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 justify-center items-center text-2xl">Amigos</ModalHeader>
                    <ModalBody>
                        <div className="flex justify-center items-center">
                            <ul className="pl-4 mt-4">
                                {friendList.map((friend) => (
                                    <li key={friend.id} className="text-sm  flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 mb-3">
                                            <Link href={`/group/${friend.id}`}>
                                                <Image
                                                    new
                                                    src={friend.photoURL === null ? null : friend.photoURL}
                                                    alt={`${friend.displayName}'s profile picture`}
                                                    className="rounded-full w-full h-full"
                                                    width={500}
                                                    height={500}
                                                    quality={100}
                                                />
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href={`/group/${friend.id}`}>
                                                <span className="truncate">{friend.displayName}</span>
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default OtherFriendsButton
