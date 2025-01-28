"use client"
import { useGroup } from "@/app/context/groupProvider"
import { auth } from "@/app/lib/firebase-config"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { useDisclosure } from "@heroui/modal"
import { signOut } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

const ProfileDropdown = ({ user }) => {
    const { onOpen } = useDisclosure()
    const { selectedGroup, setSelectedGroup } = useGroup()
    const router = useRouter()

    const logout = async () => {
        try {
            await signOut(auth)
            router.push("/login")
            setSelectedGroup(null)
            localStorage.removeItem("selectedGroup")
        } catch (err) {
            console.error(err)
        }
    }

    const reviewsPage = () => {
        router.push(`/reviews/${user?.uid}`)
    }

    const friendsPage = () => {
        router.push("/friends")
    }

    const profilePage = () => {
        router.push(`/profile/${user?.uid}`)
    }

    const groupsPage = () => {
        setSelectedGroup(null)
        localStorage.removeItem("selectedGroup") // Limpa o localStorage
        router.push(`/groups/${user?.uid}`)
    }
    return (
        <>
            <Dropdown className="dark mt-2 overflow-hidden" shouldBlockScroll={false}>
                <DropdownTrigger>
                    <Image
                        src={user?.photoURL}
                        width={100}
                        height={100}
                        quality={100}
                        className="rounded-full h-10 w-10 cursor-pointer select-none"
                        onClick={onOpen}
                        alt="avatar"
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="dropdown" variant="faded">
                    <DropdownItem>
                        <div className="flex flex-col">
                            <span className="">{user?.displayName}</span>
                            <Link
                                href={`/group/${selectedGroup?.id}`}
                                className="text-sm text-gray-500 self-start hover:text-zinc-200 transition-colors duration-200"
                            >{`${selectedGroup ? selectedGroup.name : ""}`}</Link>
                        </div>
                    </DropdownItem>
                    <DropdownItem onPress={profilePage}>Perfil</DropdownItem>
                    <DropdownItem onPress={friendsPage}>Amigos</DropdownItem>
                    <DropdownItem onPress={reviewsPage}>Reviews</DropdownItem>
                    <DropdownItem onPress={groupsPage}>Selecionar Grupo</DropdownItem>
                    <DropdownItem onPress={logout}>Logout</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

export default ProfileDropdown
