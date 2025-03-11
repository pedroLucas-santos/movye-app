"use client"
import { useGroup } from "@/app/context/groupProvider"
import { auth } from "@/app/lib/firebase-config"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { useDisclosure } from "@heroui/modal"
import { signOut } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { FiList, FiLogOut, FiSettings, FiStar, FiUser, FiUsers } from "react-icons/fi"

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

    const settingsPage = () => {
        router.push(`/settings`)
    }

    return (
        <>
            <Dropdown className="dark mt-2 overflow-hidden text-white" shouldBlockScroll={false} >
                <DropdownTrigger>
                    {user?.photoURL ? <Image
                        src={user?.photoURL ? user?.photoURL : null}
                        width={100}
                        height={100}
                        quality={100}
                        className="rounded-full h-10 w-10 cursor-pointer select-none"
                        onClick={onOpen}
                        alt="avatar"
                    /> : <div></div>}
                    
                </DropdownTrigger>
                <DropdownMenu aria-label="dropdown" variant="faded">
                    <DropdownItem variant="none" className="hover:cursor-auto" isReadOnly> 
                        <div className="flex flex-col">
                            <span className="">{user?.displayName}</span>
                            <Link
                                href={`/group/${selectedGroup?.id}`}
                                className="text-sm text-gray-500 self-start hover:text-zinc-200 transition-colors duration-200"
                            >{`${selectedGroup ? selectedGroup.name : ""}`}</Link>
                        </div>
                    </DropdownItem>
                    <DropdownItem startContent={<FiUser size={20} />} onPress={profilePage}>Perfil</DropdownItem>
                    <DropdownItem startContent={<FiUsers size={20} />} onPress={friendsPage}>Amigos</DropdownItem>
                    <DropdownItem startContent={<FiStar size={20} />} onPress={reviewsPage}>Reviews</DropdownItem>
                    <DropdownItem startContent={<FiList size={20}/>} onPress={groupsPage}>Selecionar Grupo</DropdownItem>
                    <DropdownItem startContent={<FiSettings size={20}/>} onPress={settingsPage}>Configurações</DropdownItem>
                    <DropdownItem startContent={<FiLogOut size={20}/>} onPress={logout}>Logout</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

export default ProfileDropdown
