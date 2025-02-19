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
import { getUserSettings } from "./userApi"

export const createNotification = async (notificationData, contentType) => {
    try {
        const { sender, receiverId, type, message, additionalData } = notificationData
        const notificationRef = collection(db, "notifications")

        const userSettings = await getUserSettings(receiverId)

        const notificationsEnabled = {
            review: userSettings.notificationsReviews ?? true,
            movie: userSettings.notificationsMovies ?? true,
            show: userSettings.notificationsShows ?? true
        }

        if (
            (type === "review" && !notificationsEnabled.review) ||
            (type === "group-watched" && contentType === "movie" && !notificationsEnabled.movie) ||
            (type === "group-watched" && contentType === "tv" && !notificationsEnabled.show)
        ) {
            console.log(`Notificação de tipo "${type}" ignorada devido às configurações do usuário.`)
            return
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
                })

                break
            case "group-watched":
                await addDoc(notificationRef, {
                    ...defaultNotification,
                    title: contentType === 'movie' ? "Novo Filme Adicionado" : "Nova Série Adicionada",
                    senderId: sender.uid,
                    senderName: `**${sender.displayName}**`,
                    senderPhoto: sender.photoURL,
                    watchId: additionalData?.watchId,
                    watchTitle: additionalData?.watchTitle,
                    watchBackdropUrl: additionalData?.watchBackdropUrl,
                    groupId: additionalData?.groupId,
                    groupName: additionalData?.groupName,
                })

                break
            case "review":
                await addDoc(notificationRef, {
                    ...defaultNotification,
                    title: contentType === 'movie'? "Nova Review (Filme)" : "Nova Review (Série)",
                    senderId: sender.uid,
                    senderName: `**${sender.displayName}**`,
                    senderPhoto: sender.photoURL,
                    watchBackdropUrl: additionalData?.watchBackdropUrl,
                    watchTitle: additionalData?.watchTitle,
                    watchId: additionalData?.watchId,
                })

                break
            default:
                throw new Error(`Notification type "${type}" is not supported.`)
        }
        
    } catch (err) {
        
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

export const deleteNotification = async (senderId, watchedId) => {
    try {
        const notificationQuery = query(
            collection(db, "notifications"),
            where("senderId", "==", senderId),
            where("watchId", "==", watchedId),
            where("status", "==", "unread")
        )

        const querySnapshot = await getDocs(notificationQuery);

        querySnapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, "notifications", docSnap.id));
        });
    } catch (err) {
        throw err
    }
}
