"use client"
import { useAuth } from "@/app/context/auth-context"
import { getFriendList } from "@/app/lib/friendApi"
import { getGroupData, sendGroupRequest } from "@/app/lib/groupApi"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"

const ModalInviteUsers = ({ groupCreatorId, groupId }) => {
    const {user} = useAuth()
    const [isModalClosing, setIsModalClosing] = useState(null)
    const [notMembers, setNotMembers] = useState([])
    useEffect(() => {
        const fetchNotMembers = async () => {
            try {
                const listF = await getFriendList(groupCreatorId)
                const listG = await getGroupData(groupId)
                const filteredList = listF.filter(friend => 
                    !listG.members.includes(friend.id)
                );
                setNotMembers(filteredList)
            } catch (e) {
                console.error(e)
            }
        }
        fetchNotMembers()
    }, [])

    const groupRequest = async (idUser) => {
        try {
            await sendGroupRequest(user, idUser, groupId)
            setIsModalClosing(true)
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <>
            <div
                className={`fixed flex justify-center p-12 z-10 w-dvw h-dvh bg-black/40 transition duration-300 ${
                    isModalClosing ? "animate-fadeOut" : "animate-fadeIn"
                }`}
            >
                <div className="w-[500px] h-[650px] bg-primary-dark pt-10 pb-10 pl-12 pr-12 overflow-y-auto rounded-md">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl">Convidar Amigos</span>
                        <button className="cursor-pointer justify-self-end">X</button>
                    </div>
                    <div className="flex justify-center items-center mt-2">
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
                                        <button onClick={() => {
                                            groupRequest(nMember.id)
                                        }} className="text-white bg-secondary-dark px-4 py-2 text-center rounded-md hover:bg-zinc-900 transition-colors">
                                            Convidar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalInviteUsers
