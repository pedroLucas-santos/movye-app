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
} from "firebase/firestore"

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

            console.log(membersData)

            return { ...data, createdAt: formattedDate, members: membersData }
        } else {
            console.log("No such document!")
            return null
        }
    } catch (error) {
        console.error("Error fetching group data:", error)
        return null
    }
}
