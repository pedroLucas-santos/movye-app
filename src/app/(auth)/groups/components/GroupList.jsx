"use client"
import { useGroup } from "@/app/context/groupProvider"
import { useRouter } from "next/navigation"
import React from "react"

const GroupList = ({ groups }) => {
    const {selectedGroup, setSelectedGroup} = useGroup()
    const router = useRouter()

    const handleSelectedGroup = (groupId) => {
        setSelectedGroup(groupId)
        router.push('/dashboard')
    }

    return (
        <>
            {groups.map((group) => (
                <ul key={group.id} className="flex flex-col items-center cursor-pointer">
                    <li className="hover:scale-105 transition" onClick={() => handleSelectedGroup(group.id)}>
                        <img src={group.avatar} alt={group.name} className="w-24 h-24 rounded-full border border-gray-300 shadow-lg" />
                        <span className="mt-4 font-medium text-lg">{group.name}</span>
                    </li>
                </ul>
            ))}
        </>
    )
}

export default GroupList
