"use client"

import React, { createContext, useState, useEffect, useContext } from "react"
import { auth } from "@/app/lib/firebase-config" // Caminho para a configuração do Firebase
import { onAuthStateChanged } from "firebase/auth"

// Criação do Contexto
const AuthContext = createContext()

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext)

// Provedor do Contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // Estado de carregamento

    useEffect(() => {
        // Função para lidar com as mudanças de estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user) // Atualiza o estado do usuário
            setLoading(false) // Após o carregamento, define como false
        })

        // Cleanup quando o componente for desmontado
        return () => unsubscribe()
    }, [])

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
