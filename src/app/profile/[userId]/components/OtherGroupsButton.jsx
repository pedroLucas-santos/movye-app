'use client'
import { useRouter } from "next/navigation"
import React from "react"

const OtherGroupsButton = ({length}) => {
    const router = useRouter()
    const otherGroups = () => {
        router.push(
            `?othergroups=show`
        )
    }
    return <button onClick={otherGroups} className="hover:underline">+{length - 4} outros grupos</button>
}

export default OtherGroupsButton
