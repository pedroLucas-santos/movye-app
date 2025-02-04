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
import { createNotification, updateNotificationStatus } from "./notificationApi"

export const getUserFriendCode = async (userId) => {
    try {
        const userRef = doc(db, "users", userId)
        const userDoc = await getDoc(userRef)
        if (!userDoc.exists()) {
            throw new Error(`Usuário com ID ${userId} não encontrado.`)
        }
        const userData = userDoc.data()
        return userData.friendCode
    } catch (err) {
        console.error("Error getting user document:", err)
        throw err
    }
}

export const getFriendList = async (userId) => {
    try {
        const friendsRef = collection(db, "users", userId, "friends")
        const friendsSnapshot = await getDocs(friendsRef)
        const friendList = friendsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        return friendList
    } catch (err) {
        console.error("Error getting friend list:", err)
        throw err
    }
}

export const searchFriendCode = async (friendCode) => {
    try {
        const friendQuery = query(collection(db, "users"), where("friendCode", "==", friendCode))
        const friendSnapshot = await getDocs(friendQuery)

        if (friendSnapshot.empty) {
            
            return null
        }

        const friendData = { id: friendSnapshot.docs[0].id, ...friendSnapshot.docs[0].data() }
        
        return friendData
    } catch (e) {
        console.error("Error searching friend code:", e.message)
        throw e
    }
}

export const sendFriendRequest = async (sender, receiverId) => {
    try {
        if (sender.uid === receiverId) {
            
            throw new Error("Você não pode enviar uma solicitação de amizade para si mesmo.")
        }

        const senderFriendsRef = collection(db, "users", sender.uid, "friends")
        const receiverFriendsRef = collection(db, "users", receiverId, "friends")

        const senderFriendsSnapshot = await getDocs(senderFriendsRef)
        const receiverFriendsSnapshot = await getDocs(receiverFriendsRef)

        if (senderFriendsSnapshot.docs.some((doc) => doc.id === receiverId) || receiverFriendsSnapshot.docs.some((doc) => doc.id === sender.uid)) {
            
            throw new Error("Você já é amigo dessa pessoa.")
        }

        const requestRef = collection(db, "friendRequest")

        const existingRequestQuery = query(
            requestRef,
            where("senderId", "==", sender.uid),
            where("receiverId", "==", receiverId),
            where("status", "==", "pendente")
        )

        const existingRequestSnapshot = await getDocs(existingRequestQuery)

        if (!existingRequestSnapshot.empty) {
            
            throw new Error("Pedido de amizade já enviado!")
        }

        const requestDoc = await addDoc(requestRef, {
            senderId: sender.uid,
            receiverId: receiverId,
            status: "pendente",
            createdAt: Timestamp.now(),
        })

        await createNotification({
            sender: sender,
            receiverId: receiverId,
            type: "friend-request",
            message: "enviou uma solicitação de amizade!",
            additionalData: { friendRequestId: requestDoc.id },
        })

        
    } catch (error) {
        throw error
    }
}

export const acceptFriendRequest = async (senderId, receiverId) => {
    try {
        const requestRef = collection(db, "friendRequest")
        const friendRequestSnapshot = await getDocs(query(requestRef, where("senderId", "==", senderId), where("receiverId", "==", receiverId)))

        if (!friendRequestSnapshot.empty) {
            const requestDoc = friendRequestSnapshot.docs[0]
            await updateDoc(requestDoc.ref, { status: "aceito" })

            const senderData = (await getDoc(doc(db, "users", senderId))).data()
            const receiverData = (await getDoc(doc(db, "users", receiverId))).data()

            await setDoc(doc(db, `users/${senderId}/friends`, receiverId), {
                id: receiverId,
                displayName: receiverData.displayName,
                photoURL: receiverData.photoURL,
                friendCode: receiverData.friendCode,
                addedAt: Timestamp.now(),
            })

            await setDoc(doc(db, `users/${receiverId}/friends`, senderId), {
                id: senderId,
                displayName: senderData.displayName,
                photoURL: senderData.photoURL,
                friendCode: senderData.friendCode,
                addedAt: Timestamp.now(),
            })

            
        }
    } catch (error) {
        console.error("Error accepting friend request:", error)
    }
}

export const refuseFriendRequest = async (senderId, receiverId) => {
    try {
        const requestRef = collection(db, "friendRequest");

        const friendRequestSnapshot = await getDocs(
            query(
                requestRef,
                where("senderId", "==", senderId),
                where("receiverId", "==", receiverId),
                where("status", "==", "pendente")
            )
        );

        if (!friendRequestSnapshot.empty) {
            const requestDoc = friendRequestSnapshot.docs[0];
            await updateDoc(requestDoc.ref, { status: "recusado" });
            
        } else {
            
        }
    } catch (error) {
        console.error("Error refusing friend request:", error);
    }
};

export const deleteFriend = async (user, friendId) => {
    try {
        const senderFriendsRef = collection(db, "users", user.uid, "friends")
        const receiverFriendsRef = collection(db, "users", friendId, "friends")

        const senderQuery = query(senderFriendsRef, where("id", "==", friendId))
        const receiverQuery = query(receiverFriendsRef, where("id", "==", user.uid))

        const senderFriendsSnapshot = await getDocs(senderQuery)
        const receiverFriendsSnapshot = await getDocs(receiverQuery)

        senderFriendsSnapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, "users", user.uid, "friends", docSnap.id))
        })

        receiverFriendsSnapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, "users", friendId, "friends", docSnap.id))
        })
        
    } catch (error) {
        console.error("Error deleting friend:", error)
    }
}
