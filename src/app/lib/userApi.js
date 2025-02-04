import { collection, collectionGroup, doc, getCountFromServer, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "@/app/lib/firebase-config" // Replace with your Firebase setup

export const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTJhMzAzMGExODRhYTgzMTg1MWY5MWNmMTBjNmI1ZCIsIm5iZiI6MTczMTQyNDEyMC42NTUwNDg2LCJzdWIiOiI2NzMzNmU4ZDEzYmVhZjQ2NWI3M2M5NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4ZA9UGy74W6Avpvd7CVsuj5tZkBaX6QbptP2W-DEWNM",
    },
}

export const getUserById = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId))
        if (userDoc.exists()) {
            return { id: userId, ...userDoc.data() }
        }
        return null
    } catch (error) {
        console.error("Error fetching user data:", error)
        return null
    }
}

export const getUserReviews = async (userId) => {
    try {
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId))

        // Usa o getCountFromServer para obter a contagem de documentos
        const snapshot = await getCountFromServer(reviewsQuery)

        return snapshot.data().count
    } catch (err) {
        console.error("Error fetching user reviews:", err)
        throw err
    }
}

export const getUserAvgReviews = async (userId) => {
    try {
        // Cria uma referência à coleção 'reviews' e aplica filtro pelo userId
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId))

        // Obtém todos os documentos que correspondem ao filtro
        const querySnapshot = await getDocs(reviewsQuery)

        let totalReviews = 0
        let reviewCount = 0

        // Itera sobre os documentos e soma os valores das avaliações
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            if (data.rating) {
                // Garante que o campo rating existe
                totalReviews += data.rating
                reviewCount += 1
            }
        })

        // Calcula a média das avaliações
        const average = reviewCount > 0 ? totalReviews / reviewCount : 0

        // Arredonda para cima sem casas decimais
        const roundedAvg = Math.ceil(average)

        return roundedAvg // Retorna a média arredondada para cima
    } catch (err) {
        console.error("Error fetching user average reviews:", err)
        throw err
    }
}

export const searchFavoriteMovie = async (movie) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}`, options)
        const data = await res.json()

        const filteredMovies = data.results.filter((m) => m.poster_path)

        return filteredMovies
    } catch (err) {
        console.error("Error fetching favorite movie:", err)
        throw err
    }
}

export const getMovieBackdrop = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
        const data = await response.json()
        return data.backdrops
    } catch (error) {
        console.error("Error fetching movie images:", error.message)
        throw error
    }
}

export const saveProfileEdit = async (userId, favoriteMovie, backdropPath, bio) => {
    try {
        // Referência ao documento do usuário no Firestore
        const userDocRef = doc(db, "users", userId)
        const docSnapshot = await getDoc(userDocRef)

        if (!docSnapshot.exists()) {
            // Se o documento não existir, inicializa com os campos desejados
            await setDoc(userDocRef, {
                bio: "",
                favoriteMovie: {
                    title: "",
                    id: "",
                    backdropPath: "",
                },
            })
        }

        // Atualizar os campos no Firestore
        if (favoriteMovie) {
            await setDoc(
                userDocRef,
                {
                    bio: bio || "",
                    favoriteMovie: {
                        title: favoriteMovie.title,
                        id: favoriteMovie.id,
                        backdropPath: backdropPath, // Salva o backdropPath dentro de favoriteMovie
                    },
                },
                { merge: true } // Garante que outros campos no documento não sejam sobrescritos
            )
        }else{
            await updateDoc(
                userDocRef, 
                {
                    bio: bio || "",
                },
                { merge: true }
            )
        }

        
    } catch (err) {
        console.error("Error saving favorite movie:", err)
        throw err
    }
}
