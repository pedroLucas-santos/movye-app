"use client"
import { getFriendList } from "@/app/lib/friendApi"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useLayoutEffect, useState } from "react"

const ModalOtherFriends = ({ userId }) => {
    const [friendList, setFriendList] = useState([])
    const [isModalClosing, setIsModalClosing] = useState(null)
    const searchParams = useSearchParams()
    const router = useRouter()
    const isSelectedFriend = searchParams.get("otherfriends") || null
    const closeModal = () => {
        setIsModalClosing(true)
        setTimeout(() => {
            setIsModalClosing(false)
        }, 500)
        router.replace(`/profile/${userId}`, undefined, { shallow: true })
    }
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
            {isSelectedFriend && (
                <div
                    className={`fixed flex justify-center p-12 z-10 w-dvw h-dvh bg-black/40 transition duration-300 ${
                        isModalClosing ? "animate-fadeOut" : "animate-fadeIn"
                    }`}
                >
                    <div className="w-[400px] h-[650px] bg-primary-dark pt-10 pb-10 pl-12 pr-12 overflow-y-auto rounded-md">
                        <div className="grid grid-cols-3 items-center justify-items-center">
                            <div></div>
                            <span className="text-2xl">Amigos</span>
                            <button onClick={closeModal} className="cursor-pointer justify-self-end">
                                X
                            </button>
                        </div>
                        <div className="flex justify-center items-center mt-2">
                            <ul className="pl-4 mt-4">
                                {friendList.map((friend) => (
                                    <li key={friend.id} className="text-sm  flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 mb-3">
                                            <Link href={`/group/${friend.id}`}>
                                                <Image
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
                                            <Link href={`/profile/${friend.id}`}>
                                                <span className="truncate">{friend.displayName}</span>
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

export default ModalOtherFriends
