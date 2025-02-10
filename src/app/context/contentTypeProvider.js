"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

const ContentTypeContext = createContext()

export const ContentTypeProvider = ({ children }) => {
    const [contentType, setContentType] = useState('movie')

    useEffect(() => {
        const cachedType = localStorage.getItem("contentType")
        if (cachedType) {
            setContentType(JSON.parse(cachedType))
        }
    }, [])

    // Salvar no localStorage sempre que contentType mudar
    useEffect(() => {
        if (contentType) {
            localStorage.setItem("contentType", JSON.stringify(contentType))
        }
    }, [contentType])


    

    return <ContentTypeContext.Provider value={{ contentType, setContentType }}>{children}</ContentTypeContext.Provider>
}

export const useContentType = () => useContext(ContentTypeContext)
