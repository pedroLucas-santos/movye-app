"use client"
import { getGroupsList } from "@/app/lib/groupApi"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal"
import Image from "next/image"
import Link from "next/link"
import React, { useLayoutEffect, useState } from "react"

const OtherGroupsButton = ({ length, userId }) => {
    const [groupList, setGroupList] = useState([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    useLayoutEffect(() => {
        const fetchGroupList = async () => {
            try {
                const response = await getGroupsList(userId)
                setGroupList(response)
            } catch (e) {
                console.error("Error fetching group list", e)
            }
        }
        fetchGroupList()
    }, [])
    return (
        <>
            <button onClick={onOpen} className="hover:underline">
                +{length - 4} outros grupos
            </button>
            <Modal className="dark" placement="top" scrollBehavior="inside" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 justify-center items-center text-2xl">Grupos</ModalHeader>
                    <ModalBody>
                        <div className="flex justify-center items-center">
                            <ul className="pl-4 mt-4">
                                {groupList.map((group) => (
                                    <li key={group.id} className="text-sm  flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 mb-3">
                                            <Link href={`/group/${group.id}`}>
                                                <Image
                                                    src={group.image === "" || null ? null : group.image}
                                                    alt={`${group.name}'s profile picture`}
                                                    className="rounded-full w-full h-full"
                                                    width={500}
                                                    height={500}
                                                    quality={100}
                                                />
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href={`/group/${group.id}`}>
                                                <span className="truncate">{group.name}</span>
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

export default OtherGroupsButton
