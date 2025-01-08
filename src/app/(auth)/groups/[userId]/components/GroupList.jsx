"use client"
import { useGroup } from "@/app/context/groupProvider"
import { getGroupsList } from "@/app/lib/groupApi"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { FiEdit } from "react-icons/fi"

const GroupList = ({ userId }) => {
    const { selectedGroup, setSelectedGroup } = useGroup()
    const router = useRouter()
    const [groupsList, setGroupsList] = useState(null)

    const handleSelectedGroup = (groupId) => {
        setSelectedGroup(groupId)
    }

    useEffect(() => {
        const groupsList = async () => {
            try {
                const res = await getGroupsList(userId)
                setGroupsList(res)
            } catch (err) {
                console.error(err)
            }
        }
        groupsList()
    }, [])

    useEffect(() => {
        if (selectedGroup) {
            router.push(`/dashboard/${selectedGroup.name}`)
        }
    }, [selectedGroup])

    return (
        <>
            {groupsList?.map((group) => (
                <ul key={group.id} className="flex flex-col items-center cursor-pointer">
                    {console.log(group)}
                    <li className="hover:scale-105 transition relative" onClick={() => handleSelectedGroup(group)}>
                        <img src={group.image} alt={group.name} className="w-24 h-24 rounded-full border border-gray-300 shadow-lg object-cover" />
                        <span className="mt-4 font-medium text-lg">{group.name}</span>
                        {/* TODO: Fazer a funcão de editar o grupo */}
                        <FiEdit className="absolute hover:bg-blue-500 top-0 right-2 text-white bg-gray-600 rounded-full p-1 cursor-pointer w-6 h-6" />
                    </li>
                </ul>
            ))}
        </>
    )
}

export default GroupList
