import { db } from "../lib/firebase-config"
import {
    getDocs,
    collection,
    updateDoc,
    doc,
    Timestamp,
    getDoc,
    setDoc,
    query,
    orderBy,
    where,
    collectionGroup,
    limit,
    deleteDoc,
    addDoc,
} from "firebase/firestore"
import { getGroupData } from "./groupApi"

export const createNotification = async (notificationData) => {
    try {
        const { sender, receiverId, type, message, additionalData } = notificationData
        const notificationRef = collection(db, "notifications")
        //TODO: terminar de fazer a notificacao do grupo request
        if(type === 'group-request'){
            const groupData = await getGroupData(additionalData.groupId)
            additionalData.groupName = groupData.name
        }

        const defaultNotification = {
            receiverId,
            type,
            message,
            createdAt: Timestamp.now(),
            status: "unread",
        }

        switch (type) {
            case "friend-request":
                await addDoc(notificationRef, {
                    ...defaultNotification,
                    title: "Solicitação de Amizade",
                    senderId: sender.uid,
                    senderName: sender.displayName,
                    senderPhoto: sender.photoURL,
                    friendRequestId: additionalData?.friendRequestId,
                })

                break
            case "group-request":
                await addDoc(notificationRef, {
                    ...defaultNotification,
                    title: "Convite para Grupo",
                    senderId: sender.uid,
                    senderName: sender.displayName,
                    senderPhoto: sender.photoURL,
                    groupRequestId: additionalData?.groupRequestId,
                    groupId: additionalData?.groupId,
                    groupName: additionalData?.groupName,
                })

                break
            default:
                throw new Error(`Notification type "${type}" is not supported.`)
        }
        console.log(`Notification of type "${type}" created successfully.`)
    } catch (err) {
        console.log("Error creating notification:", err)
        throw err
    }
}

export const updateNotificationStatus = async (notificationId, newStatus) => {
    try {
        const notificationRef = doc(db, "notifications", notificationId)
        await updateDoc(notificationRef, { status: newStatus })
    } catch (err) {
        console.error("Error updating notification status:", err)
        throw err
    }
}
