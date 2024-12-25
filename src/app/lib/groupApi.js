import { db, storage } from "../lib/firebase-config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    try{
        const groupsRef = collection(db, "groups");

        // Cria a consulta para buscar grupos do usuário
        const q = query(groupsRef, where("members", "array-contains", userId));

        // Executa a consulta
        const querySnapshot = await getDocs(q);

        // Mapeia os resultados para um array
        const groups = querySnapshot.docs.map((doc) => ({
            id: doc.id, // ID do documento
            ...doc.data(), // Dados do documento
        }));

        return groups;
    }catch (error) {
        console.error("Erro ao buscar a lista de grupos:", error)
        return []
    }
}

