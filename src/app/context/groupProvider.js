"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

const GroupContext = createContext()

export const GroupProvider = ({ children }) => {
    const [selectedGroup, setSelectedGroup] = useState(null)

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

    console.log(selectedGroup)

    return <GroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>{children}</GroupContext.Provider>
}

export const useGroup = () => useContext(GroupContext)
