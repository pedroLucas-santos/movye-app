"use client"
import React, { createContext, useContext, useState, useEffect } from "react"
import { onSnapshot, collection, query, orderBy, where } from "firebase/firestore"
import { db } from "../lib/firebase-config" // Importe sua instância do Firestore
import { useAuth } from "./auth-context"
import LoadingSpinner from "../shared/LoadingSpinner"

// Cria o contexto
const NotificationContext = createContext()

// Provedor do contexto
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [loadingNoti, setLoadingNoti] = useState(true)
    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading || !user) {
            return // Se o usuário estiver carregando ou não estiver disponível, não faz nada
        }
        // Cria uma consulta para notificações ordenadas por data
        const notificationsQuery = query(collection(db, "notifications"), where("receiverId", "==", user.uid), orderBy("createdAt", "desc"))

        // Escuta as alterações em tempo real
        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            const notificationsData = snapshot.docs.map((doc) => ({
                id: doc.id, // Adiciona o ID do documento
                ...doc.data(),
            }))
            setNotifications(notificationsData)
            setLoadingNoti(false)
        })

        // Limpa a assinatura ao desmontar o componente
        return () => unsubscribe()
    }, [user, loading])

    console.log(notifications)

    return <NotificationContext.Provider value={{ notifications, loadingNoti }}>{children}</NotificationContext.Provider>
}

// Hook para usar o contexto
export const useNotifications = () => {
    return useContext(NotificationContext)
}
