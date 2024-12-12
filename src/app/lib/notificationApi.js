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

export const createNotification = async (notificationData) => {
    try {
        const { sender, receiverId, type, message, additionalData } = notificationData
        const notificationRef = collection(db, "notifications")

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
            default:
                throw new Error(`Notification type "${type}" is not supported.`)
        }
        console.log(`Notification of type "${type}" created successfully.`)
    } catch (err) {
        console.log("Error creating notification:", err)
        throw err
    }
}
