"use client"
import React, { createContext, useContext, useState, useEffect } from "react"
import { onSnapshot, collection, query, orderBy, where } from "firebase/firestore"
import { db } from "../lib/firebase-config"
import { useAuth } from "./auth-context"
import LoadingSpinner from "../shared/LoadingSpinner"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [loadingNoti, setLoadingNoti] = useState(true)
    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading || !user) {
            return
        }

        const notificationsQuery = query(
            collection(db, "notifications"),
            where("receiverId", "==", user.uid),
            where("status", "==", "unread"),
            orderBy("receiverId"),
            orderBy("status"),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            const notificationsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setNotifications(notificationsData)
            setLoadingNoti(false)
        })

        return () => unsubscribe()
    }, [user, loading])

    return <NotificationContext.Provider value={{ notifications, loadingNoti }}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
    return useContext(NotificationContext)
}
