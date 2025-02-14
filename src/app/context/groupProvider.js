"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"

const GroupContext = createContext()

export const GroupProvider = ({ children }) => {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        const cachedGroup = localStorage.getItem("selectedGroup")
        if (cachedGroup) {
            setSelectedGroup(JSON.parse(cachedGroup))
        }
    }, [])

    useEffect(() => {
        if (selectedGroup) {
            localStorage.setItem("selectedGroup", JSON.stringify(selectedGroup))
        }
    }, [selectedGroup])


    

    return <GroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>{children}</GroupContext.Provider>
}

export const useGroup = () => useContext(GroupContext)
