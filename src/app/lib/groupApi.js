import { db, storage } from "../lib/firebase-config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

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
    arrayUnion,
    arrayRemove,
    deleteField,
} from "firebase/firestore"
import { createNotification } from "./notificationApi"

export const getUserNameById = async (userId) => {
    try {
        const userDocRef = doc(db, "users", userId)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
            const userData = userDoc.data()
            return userData.displayName || "Anonymous"
        } else {
            console.error("Usuário não encontrado:", userId)
            return null
        }
    } catch (error) {
        console.error("Erro ao buscar o nome do usuário:", error)
        return null
    }
}

export const createNewGroup = async (groupName, groupImage, userId) => {
    try {
        const userName = await getUserNameById(userId)

        let imageUrl = null
        if (groupImage) {
            const storageRef = ref(storage, `groups/${groupName}-${Date.now()}`)
            const snapshot = await uploadBytes(storageRef, groupImage)
            imageUrl = await getDownloadURL(snapshot.ref) // Obtém a URL da imagem
        } else {
            throw new Error("Nenhuma imagem selecionada!")
        }

        const groupData = {
            name: groupName,
            image: imageUrl,
            createdBy: userName,
            creatorId: userId,
            createdAt: Timestamp.now(),
            members: [userId], // Criador é automaticamente o primeiro membro
        }

        // Adiciona o grupo à coleção "groups" no Firestore
        await addDoc(collection(db, "groups"), groupData)

        return true
    } catch (error) {
        console.error("Erro ao criar o grupo:", error)
        return false
    }
}

export const getGroupsList = async (userId) => {
    try {
        const groupsRef = collection(db, "groups")

        // Cria a consulta para buscar grupos do usuário
        const q = query(groupsRef, where("members", "array-contains", userId), orderBy("createdAt", "asc"))

        // Executa a consulta
        const querySnapshot = await getDocs(q)

        // Mapeia os resultados para um array
        const groups = querySnapshot.docs.map((doc) => ({
            id: doc.id, // ID do documento
            ...doc.data(), // Dados do documento
        }))

        return groups
    } catch (error) {
        console.error("Erro ao buscar a lista de grupos:", error)
        return []
    }
}

export const getGroupData = async (groupId) => {
    try {
        // Referência ao documento do grupo
        const groupRef = doc(db, "groups", groupId)

        // Busca o documento do grupo
        const querySnapshot = await getDoc(groupRef)

        if (querySnapshot.exists()) {
            const data = querySnapshot.data()

            let formattedDate = ""
            if (data.createdAt) {
                // Verifica e formata a data
                if (data.createdAt instanceof Timestamp) {
                    const date = data.createdAt.toDate()
                    formattedDate = date.toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                } else if (typeof data.createdAt === "number") {
                    const date = new Date(data.createdAt * 1000) // Converter segundos para milissegundos
                    formattedDate = date.toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                }
            }

            // Busca os dados dos membros
            const membersIds = data.members || [] // Garante que o array exista
            const usersCollectionRef = collection(db, "users")

            // Aqui buscamos todos os documentos de 'users' e filtramos aqueles cujo ID está em 'membersIds'
            const membersData = []
            for (const memberId of membersIds) {
                const userDocRef = doc(usersCollectionRef, memberId) // Referência ao documento do usuário
                const userDoc = await getDoc(userDocRef) // Busca o documento do usuário

                if (userDoc.exists()) {
                    membersData.push({
                        id: userDoc.id, // ID do documento
                        ...userDoc.data(), // Dados do documento
                    })
                }
            }

            

            return { ...data, id: groupId, createdAt: formattedDate, members: membersData }
        } else {
            
            return null
        }
    } catch (error) {
        console.error("Error fetching group data:", error)
        return null
    }
}

export const sendGroupRequest = async (sender, receiverId, group) => {
    try {
        if (sender.uid === receiverId) {
            
            throw new Error("Você não pode convidar você mesmo para o grupo!")
        }

        const requestRef = collection(db, "groupRequest")

        const existingRequestQuery = query(
            requestRef,
            where("senderId", "==", sender.uid),
            where("receiverId", "==", receiverId),
            where("groupId", "==", group.id),
            where("status", "==", "pendente") // Verifica apenas solicitações pendentes
        )

        const existingRequestSnapshot = await getDocs(existingRequestQuery)

        if (!existingRequestSnapshot.empty) {
            
            throw new Error("Um convite para o grupo já foi enviado para o usuário!")
        }

        const requestDoc = await addDoc(requestRef, {
            senderId: sender.uid,
            receiverId: receiverId,
            groupId: group.id,
            status: "pendente",
            createdAt: Timestamp.now(),
        })

        await createNotification({
            sender: sender,
            receiverId: receiverId,
            type: "group-request",
            message: `te convidou para o grupo ${group.name}`,
            additionalData: { groupRequestId: requestDoc.id, groupId: group.id },
        })

        
    } catch (err) {
        console.error("Error sending group request:", err)
        throw err
    }
}

export const acceptGroupRequest = async (senderId, receiverId, groupId) => {
    try {
        // Atualize o status da solicitação para "aceito"
        const requestRef = collection(db, "groupRequest")
        const groupRequestSnapshot = await getDocs(
            query(
                requestRef,
                where("senderId", "==", senderId),
                where("receiverId", "==", receiverId),
                where("groupId", "==", groupId),
                where("status", "==", "pendente")
            )
        )

        if (!groupRequestSnapshot.empty) {
            const requestDoc = groupRequestSnapshot.docs[0]
            await updateDoc(requestDoc.ref, { status: "aceito" })

            await updateDoc(doc(db, `groups/${groupId}`), {
                members: arrayUnion(receiverId),
            })

            
        }
    } catch (error) {
        console.error("Error accepting group request:", error)
    }
}

export const refuseGroupRequest = async (senderId, receiverId, groupId) => {
    try {
        const requestRef = collection(db, "groupRequest")

        const groupRequestSnapshot = await getDocs(
            query(
                requestRef,
                where("senderId", "==", senderId),
                where("receiverId", "==", receiverId),
                where("groupId", "==", groupId),
                where("status", "==", "pendente")
            )
        )

        if (!groupRequestSnapshot.empty) {
            const requestDoc = groupRequestSnapshot.docs[0]
            await updateDoc(requestDoc.ref, { status: "recusado" })
            
        } else {
            
        }
    } catch (error) {
        console.error("Error refusing group request:", error)
    }
}

export const removeMemberFromGroup = async (groupId, memberId) => {
    try {
        await updateDoc(doc(db, `groups/${groupId}`), {
            members: arrayRemove(memberId),
        })

        
    } catch (err) {
        throw new Error("Error removing member from group", err)
    }
}

export const deleteGroup = async (groupCreatorId, groupId) => {
    try {
        const groupRef = doc(db, "groups", groupId)
        const groupDoc = await getDoc(groupRef)

        if (!groupDoc.exists()) {
            
            throw new Error("Grupo não existe!")
        }

        if (groupCreatorId !== groupDoc.data().creatorId) {
            
            throw new Error("Você não é o criador do grupo!")
        }

        await deleteDoc(groupRef)
    } catch (e) {
        console.error("Error checking group creator permissions:", e)
        throw e
    }
}

export const deleteMovieFromGroup = async (groupId, movieId) => {
    try {
        if (!groupId || !movieId) {
            throw new Error("Missing groupId or movieId")
        }
        

        // Reference the movie document inside the watchedMovies subcollection
        const movieRef = doc(db, "groups", groupId, "watchedMovies", movieId)

        // Delete the document
        await deleteDoc(movieRef)

        const watchedMoviesRef = collection(db, "groups", groupId, "watchedMovies")
        const watchedMoviesSnapshot = await getDocs(watchedMoviesRef)

        // If there are no more movies, delete the lastWatchedMovie field
        if (watchedMoviesSnapshot.empty) {
            const groupRef = doc(db, "groups", groupId)
            await updateDoc(groupRef, {
                lastWatchedMovie: deleteField(),
            })
        }
        
    } catch (e) {
        console.error("Error deleting movie from group:", e)
        throw e // Re-throw error for better error handling
    }
}
