"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"

const GroupContext = createContext()

export const GroupProvider = ({ children }) => {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        const cachedGroup = localStorage.getItem("selectedGroup");
        if (cachedGroup) {
            setSelectedGroup(JSON.parse(cachedGroup));
        }
    }, []);

    // Salvar no localStorage sempre que selectedGroup mudar
    useEffect(() => {
        if (selectedGroup) {
            localStorage.setItem("selectedGroup", JSON.stringify(selectedGroup));
        }
    }, [selectedGroup]);

   /*  useEffect(() => {
        setSelectedGroup(null); // Limpa o estado de selectedGroup
        localStorage.removeItem("selectedGroup"); // Limpa o localStorage
    }, [user]) */

    console.log(selectedGroup)

    return <GroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>{children}</GroupContext.Provider>
}

export const useGroup = () => useContext(GroupContext)
