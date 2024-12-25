"use client"
import { useGroup } from "@/app/context/groupProvider"
import { getGroupsList } from "@/app/lib/groupApi"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const GroupList = ({ userId }) => {
    const {selectedGroup, setSelectedGroup} = useGroup()
    const router = useRouter()
    const [groupsList, setGroupsList] = useState(null)

    const handleSelectedGroup = (groupId) => {
        setSelectedGroup(groupId)
        router.push('/dashboard')
    }

    useEffect(() => {
        const groupsList = async () => {
            try {
                const res = await getGroupsList(userId)
                setGroupsList(res)
            }catch (err) {
                console.error(err)
            }
        }
        groupsList()
    }, [])

    return (
        <>
            {groupsList?.map((group) => (
                <ul key={group.id} className="flex flex-col items-center cursor-pointer">
                    <li className="hover:scale-105 transition" onClick={() => handleSelectedGroup(group)}>
                        <img src={group.image} alt={group.name} className="w-24 h-24 rounded-full border border-gray-300 shadow-lg object-cover" />
                        <span className="mt-4 font-medium text-lg">{group.name}</span>
                    </li>
                </ul>
            ))}
        </>
    )
}

export default GroupList
