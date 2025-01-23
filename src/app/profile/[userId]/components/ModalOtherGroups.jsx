"use client"
import { getGroupsList } from "@/app/lib/groupApi"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useLayoutEffect, useState } from "react"

const ModalOtherGroups = ({ userId }) => {
    const [groupList, setGroupList] = useState([])
    const searchParams = useSearchParams()
    const router = useRouter()
    const isSelectedGroup = searchParams.get("othergroups") || null
    const [isModalClosing, setIsModalClosing] = useState(null)

    const closeModal = () => {
        setIsModalClosing(true)
        setTimeout(() => {
            setIsModalClosing(false)
        }, 500)
        router.replace(`/profile/${userId}`, undefined, {shallow: true})
    }
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
            {isSelectedGroup && (
                <div className={`fixed flex justify-center p-12 z-10 w-dvw h-dvh bg-black/40 transition duration-300 ${
                    isModalClosing ? "animate-fadeOut" : "animate-fadeIn"
                }`}>
                    <div className="w-[400px] h-[650px] bg-primary-dark pt-10 pb-10 pl-12 pr-12 overflow-y-auto rounded-md">
                        <div className="grid grid-cols-3 items-center justify-items-center">
                            <div></div>
                            <span className="text-2xl">Grupos</span>
                            <button onClick={closeModal} className="cursor-pointer justify-self-end">X</button>
                        </div>
                        <div className="flex justify-center items-center mt-2">
                            <ul className="pl-4 mt-4">
                                {groupList.map((group) => (
                                    <li key={group.id} className="text-sm  flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 mb-3">
                                            <Link href={`/group/${group.id}`}>
                                                <Image
                                                    src={group.image === null ? null : group.image}
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
                    </div>
                </div>
            )}
        </>
    )
}

export default ModalOtherGroups
