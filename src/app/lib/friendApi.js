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

export const searchFriendCode = async (friendCode) => {
    try {
        const friendQuery = query(collection(db, "users"), where("friendCode", "==", friendCode))
        const friendSnapshot = await getDocs(friendQuery)

        if (friendSnapshot.empty) {
            console.log("No matching friend found.")
            return null // Retorna `null` se nenhum amigo for encontrado
        }

        // Retorna o primeiro item encontrado (já que friendCode é único)
        const friendData = { id: friendSnapshot.docs[0].id, ...friendSnapshot.docs[0].data() }
        console.log(friendData)
        return friendData
    } catch (e) {
        console.error("Error searching friend code:", e.message)
        throw e
    }
}

export const sendFriendRequest = async (senderId, receiverId) => {
    try {
        // Verifique se a solicitação já existe
        const requestRef = collection(db, "friendRequest")

        const existingRequestQuery = query(
            requestRef,
            where("from", "==", senderId),
            where("to", "==", receiverId),
            where("status", "==", "pendente") // Verifica apenas solicitações pendentes
        )

        const existingRequestSnapshot = await getDocs(existingRequestQuery)

        if (!existingRequestSnapshot.empty) {
            console.log("Friend request already exists.")
            throw new Error ("Pedido de amizade já enviado!")
        }

        const requestDoc = await addDoc(requestRef, {
            from: senderId,
            to: receiverId,
            status: "pendente", // Solicitação pendente
            createdAt: new Date(),
        })

        console.log("Friend request sent:", requestDoc.id)
    } catch (error) {
        throw error
    }
}

export const acceptFriendRequest = async (senderId, receiverId) => {
    try {
        // Atualize o status da solicitação para "aceito"
        const requestRef = collection(db, "friendRequest")
        const friendRequestSnapshot = await getDocs(query(requestRef, where("senderId", "==", senderId), where("receiverId", "==", receiverId)))

        if (!friendRequestSnapshot.empty) {
            const requestDoc = friendRequestSnapshot.docs[0]
            await updateDoc(requestDoc.ref, { status: "accepted" })

            // Obtenha os dados do amigo a partir do documento da solicitação de amizade
            const senderData = (await getDoc(doc(db, "users", senderId))).data()
            const receiverData = (await getDoc(doc(db, "users", receiverId))).data()

            // Adicione os dados do amigo na subcoleção `friends`
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

            console.log("Friend request accepted and friend data saved")
        }
    } catch (error) {
        console.error("Error accepting friend request:", error)
    }
}
