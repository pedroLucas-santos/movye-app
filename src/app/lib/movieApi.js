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
} from "firebase/firestore"
import { fetchShowPoster } from "./showApi"

export const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTJhMzAzMGExODRhYTgzMTg1MWY5MWNmMTBjNmI1ZCIsIm5iZiI6MTczMTQyNDEyMC42NTUwNDg2LCJzdWIiOiI2NzMzNmU4ZDEzYmVhZjQ2NWI3M2M5NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4ZA9UGy74W6Avpvd7CVsuj5tZkBaX6QbptP2W-DEWNM",
    },
}

export const fetchMoviePoster = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
        const data = await response.json()

        if (data.posters && data.posters.length > 0) {
            const filteredPosters = data.posters.filter((poster) => poster.iso_639_1 == "en")

            if (filteredPosters.length > 0) {
                const posterPath = filteredPosters[0].file_path
                return `https://image.tmdb.org/t/p/w500${posterPath}`
            }
        } /* else {
            throw new Error("No posters found")
        } */
    } catch (error) {
        throw new Error("Error fetching movie images: " + error.message)
    }
}

export const fetchMovieBackdrop = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
        const data = await response.json()

        if (data.backdrops && data.backdrops.length > 0) {
            const filteredBackdrops = data.backdrops.filter(
                (backdrop) => backdrop.width === 3840 && backdrop.height === 2160 && backdrop.iso_639_1 == null
            )

            if (filteredBackdrops.length > 0) {
                const randomBackdrop = filteredBackdrops[Math.floor(Math.random() * filteredBackdrops.length)]
                const backdropPath = randomBackdrop.file_path
                return `https://image.tmdb.org/t/p/original${backdropPath}`
            }
        } /* else {
            throw new Error("No posters found")
        } */
    } catch (error) {
        throw new Error("Error fetching movie images: " + error.message)
    }
}

export const fetchSearchedMovieName = async (movie, groupId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}`, options)
        const data = await response.json()

        const snapshot = await getDocs(collection(db, `groups/${groupId}/watchedMovies`))
        const watchedMovies = snapshot.docs.map((doc) => doc.id)

        if (data.results && data.results.length > 0) {
            const filteredNotWatched = data.results.filter((notWatched) => !watchedMovies.includes(notWatched.original_title))
            return filteredNotWatched
        } else {
            throw new Error("No movie found")
        }
    } catch (error) {
        throw new Error("Error fetching movie name: " + error.message)
    }
}

export const fetchAddMovie = async (movieId, groupId) => {
    try {
        

        // Fetch movie details from TheMovieDB API
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
        const movie = await response.json()
        

        // References for Firestore
        const groupRef = doc(db, "groups", groupId) // Group document reference
        const movieDocRef = doc(groupRef, "watchedMovies", movie.original_title.toString()) // Watched movies collection under the group

        const movieDocSnap = await getDoc(movieDocRef)

        if (!movieDocSnap.exists()) {
            // Update the last watched movie for the group
            await updateDoc(groupRef, {
                lastWatchedMovie: {
                    genre: movie.genres[0]?.name || "Unknown",
                    id: movie.id,
                    poster_path: movie.poster_path,
                    rating: 0,
                    release_date: movie.release_date,
                    title: movie.original_title,
                    watched_at: Timestamp.now(),
                },
            })

            // Create the watched movie in the group's watchedMovies collection
            await setDoc(movieDocRef, {
                backdrop_path: movie.backdrop_path,
                genre: movie.genres[0]?.name || "Unknown",
                id: movie.id,
                poster_path: movie.poster_path,
                rating: 0,
                release_date: movie.release_date,
                title: movie.original_title,
                watched_at: Timestamp.now(),
            })
        }
    } catch (e) {
        console.error("Error in fetchAddMovie:", e)
        throw new Error(e.message)
    }
}

export const fetchMovieLastWatched = async (groupId) => {
    try {
        // Reference the group document
        const groupDocRef = doc(db, "groups", groupId)
        const groupDoc = await getDoc(groupDocRef)

        if (!groupDoc.exists()) {
            throw new Error(`Group with ID ${groupId} not found.`)
        }

        const groupData = groupDoc.data()

        // Check if the group has a lastWatchedMovie field
        if (!groupData.lastWatchedMovie) {
            

            // Default data for a new last watched movie
            const defaultLastWatchedMovie = {
                genre: "",
                id: 0,
                poster_path: "",
                rating: 0,
                release_date: "",
                title: "",
                watched_at: Timestamp.now(),
            }

            // Update the group's lastWatchedMovie field
            await setDoc(groupDocRef, { ...groupData, lastWatchedMovie: defaultLastWatchedMovie })

            
            return defaultLastWatchedMovie
        }

        // Return the lastWatchedMovie field from the group document
        const lastWatchedMovie = groupData.lastWatchedMovie
        

        return {
            ...lastWatchedMovie,
            posterUrl: await fetchMoviePoster(lastWatchedMovie.id),
            backdropUrl: await fetchMovieBackdrop(lastWatchedMovie.id),
        }
    } catch (error) {
        throw new Error("Error fetching last watched movie: " + error.message)
    }
}

export const fetchMoviesWatched = async (groupId) => {
    try {
        // Reference the "watchedMovies" subcollection inside the specific group
        const watchedMoviesQuery = query(collection(db, "groups", groupId, "watchedMovies"), orderBy("watched_at", "desc"))
        const watchedMoviesSnapshot = await getDocs(watchedMoviesQuery)
        const movies = watchedMoviesSnapshot.docs.map((doc) => {
            const movieData = doc.data()

            const watchedAtDate =
                movieData.watched_at instanceof Timestamp
                    ? movieData.watched_at
                          .toDate()
                          .toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                          })
                          .replace(",", " às")
                    : null

            return {
                doc_id: doc.id,
                ...movieData,
                watched_at: watchedAtDate, // Include the formatted date
            }
        })

        

        // Fetch reviews related to the group
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("group", "==", groupId))
        const reviewsSnapshot = await getDocs(reviewsQuery)
        const reviews = reviewsSnapshot.docs.map((doc) => doc.data())

        

        // Combine movies with their reviews
        const moviesWithRatings = movies.map((movie) => {
            const movieReviews = reviews.filter((review) => review.id_movie === movie.id)

            

            // Calculate average rating
            const totalReviews = movieReviews.length
            const averageRating = totalReviews > 0 ? movieReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews : 0

            return {
                ...movie,
                averageRating,
            }
        })

        

        return moviesWithRatings
    } catch (e) {
        throw new Error("Error fetching watched movies with ratings: " + e.message)
    }
}

export const fetchMovieReview = async (movieId, newRating, movieSelected, newReview, uid, groupId, contentType) => {
    try {
        //update watched movies review
        const movieQuery = query(collection(db, "groups", groupId, "watchedMovies"), where("id", "==", movieId))
        const snapshot = await getDocs(movieQuery)

        if (!snapshot.empty) {
            snapshot.forEach(async (docSnapshot) => {
                const docRef = doc(db, "groups", groupId, "watchedMovies", docSnapshot.id)

                await updateDoc(docRef, { rating: newRating })

                
            })
        } else {
            
        }
        const movieDoc = snapshot.docs[0].data()
        

        //create movie review
        const movieDocRef = doc(db, "users", uid, "reviews", movieSelected.title.toString())

        await setDoc(movieDocRef, {
            id_movie: movieSelected.id,
            rating: newRating,
            review: newReview,
            reviewed_at: Timestamp.now(),
            user_id: uid,
            genre: movieSelected.genre,
            title: movieSelected.title,
            backdrop_path: movieSelected.backdrop_path,
            group: groupId,
            groupName: await fetchGroupNameById(groupId),
            content: contentType
        })
    } catch (e) {
        throw new Error("Error fetching movie review: " + e.message)
    }
}

export const fetchUserLastMovieReview = async (groupId, lastMovieId) => {
    try {
        

        const groupDocRef = doc(db, "groups", groupId)
        const groupDoc = await getDoc(groupDocRef)

        if (!groupDoc.exists()) {
            throw new Error(`Grupo com ID ${groupId} não encontrado.`)
        }

        const groupData = groupDoc.data()
        const members = groupData.members || []

        const reviewsPromises = members.map(async (memberId) => {
            const reviewsQuery = query(collection(db, "users", memberId, "reviews"))
            const snapshot = await getDocs(reviewsQuery)

            const reviews = snapshot.docs
                .map((doc) => {
                    const data = doc.data()
                    const idMovie = data.id_movie

                    let formattedDate = ""

                    if (idMovie === lastMovieId) {
                        if (data.reviewed_at) {
                            const timestamp = data.reviewed_at
                            const date = timestamp.toDate()
                            formattedDate = date.toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })
                        }

                        return {
                            id: doc.id,
                            review: data.review || "",
                            rating: data.rating || 0,
                            reviewed_at: formattedDate,
                            user_id: data.user_id,
                            group: data.group,
                            groupName: data.groupName,
                        }
                    }

                    return null
                })
                .filter((review) => review !== null)

            if (reviews.length > 0) {
                const userDocRef = doc(db, "users", memberId)
                const userDoc = await getDoc(userDocRef)

                if (!userDoc.exists()) {
                    throw new Error(`Usuário com ID ${memberId} não encontrado.`)
                }

                const userData = userDoc.data()

                return reviews.map((review) => ({
                    ...review,
                    user: {
                        id: userDoc.id,
                        displayName: userData.displayName || "",
                        photoURL: userData.photoURL || null,
                    },
                }))
            }

            return []
        })

        const reviewsWithUsers = await Promise.all(reviewsPromises)
        const allReviews = reviewsWithUsers.flat()

        if (allReviews.length === 0) {
            return {
                review: "",
                rating: null,
                reviewed_at: "",
                user: {
                    displayName: "",
                    photoURL: null,
                },
                group: "",
            }
        }

        return allReviews
    } catch (e) {
        throw new Error("Error fetching user last movie review: " + e.message)
    }
}

export const fetchUserReviews = async (userId) => {
    try {
        
        // Cria uma referência para a coleção "reviews" no Firestore
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId))
        const snapshot = await getDocs(reviewsQuery)

        // Mapeia os documentos para um array
        const reviews = snapshot.docs.map((doc) => ({
            id: doc.id, // ID do documento
            ...doc.data(), // Dados do documento
        }))

        return reviews // Retorna um array de reviews
    } catch (error) {
        console.error("Erro ao buscar reviews no Firestore:", error)
        throw error
    }
}

export const fetchLastReviewUser = async (userId) => {
    try {
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), orderBy("reviewed_at", "desc"))

        const snapshot = await getDocs(reviewsQuery)

        if (snapshot.empty) {
            return {
                review: "",
                rating: null,
                reviewed_at: "",
                user: {
                    displayName: "",
                    photoURL: null,
                },
                mostViewedGenre: "", // Gênero mais visto
                totalReviews: 0,
                averageRating: 0, // Contagem total de reviews
                group: "",
            }
        }

        const genreCounts = {}
        let lastReview = null
        let totalReviews = 0 // Inicializar contador de reviews
        let totalRating = 0

        snapshot.docs.forEach((doc, index) => {
            const data = doc.data()
            totalReviews++ // Incrementar o contador de reviews

            if (data.rating) {
                totalRating += data.rating
            }
            // Contar os gêneros
            if (data.genre) {
                genreCounts[data.genre] = (genreCounts[data.genre] || 0) + 1
            }

            // Salvar a última review
            if (index === 0) {
                lastReview = {
                    id: doc.id,
                    ...data,
                }
            }
        })

        // Determinar o gênero mais visto
        const mostViewedGenre = Object.entries(genreCounts).reduce(
            (max, [genre, count]) => {
                return count > max.count ? { genre, count } : max
            },
            { genre: "", count: 0 }
        ).genre

        const averageRating = totalReviews > 0 ? Math.ceil(totalRating / totalReviews) : 0

        let formattedDate = ""

        if (lastReview?.reviewed_at) {
            const timestamp = lastReview.reviewed_at
            const date = timestamp.toDate()
            formattedDate = date.toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
        }

        const userDocRef = doc(db, "users", userId)
        const userDoc = await getDoc(userDocRef)

        if (!userDoc.exists()) {
            throw new Error(`Usuário com ID ${userId} não encontrado.`)
        }

        const userData = userDoc.data()

        return {
            id: lastReview?.id || "",
            review: lastReview?.review || "",
            rating: lastReview?.rating || 0,
            reviewed_at: formattedDate,
            user: {
                displayName: userData.displayName || "",
                photoURL: userData.photoURL || null,
            },
            mostViewedGenre: mostViewedGenre, // Gênero mais visto
            totalReviews: totalReviews,
            averageRating: averageRating, // Contagem total de reviews
            ...userData,
        }
    } catch (e) {
        throw new Error("Error fetching user's last movie review: " + e.message)
    }
}

export const fetchReviewsCard = async (userId, contentType) => {
    try {
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), where('content', '==', contentType),orderBy("reviewed_at", "desc"))

        const snapshot = await getDocs(reviewsQuery)

        if (snapshot.empty) {
            return []
        }

        const reviews = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data()
                let formattedDate = ""

                // Formata a data da review
                if (data.reviewed_at) {
                    const timestamp = data.reviewed_at
                    const date = timestamp.toDate()
                    formattedDate = date.toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                }

                const poster_url = await fetchMoviePoster(data.id_movie)
                const poster_url2 = await fetchShowPoster(data.id_movie)
                
                return {
                    id: doc.id,
                    id_movie: data.id_movie || "",
                    review: data.review || "",
                    rating: data.rating || 0,
                    reviewed_at: formattedDate,
                    genre: data.genre || "",
                    posterUrl: poster_url || poster_url2,
                    group: data.group || "",
                    groupName: data.groupName || "",
                    content: data.content || "",
                }
            })
        )

        return reviews
    } catch (e) {
        throw new Error("Error fetching reviews card: " + e.message)
    }
}

export const fetchEditReview = async (userId, reviewId) => {
    try {
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), where("id_movie", "==", reviewId))
        const snapshot = await getDocs(reviewsQuery)

        if (!snapshot.empty) {
            const review = snapshot.docs[0].data()
            return review
        } else {
            
            return null
        }
    } catch (e) {
        throw new Error("Error fetching edit review: " + e.message)
    }
}

export const fetchUpdateReview = async (userId, reviewId, updatedReview, updatedRating) => {
    try {
        // Query to find the specific review
        const reviewQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), where("id_movie", "==", reviewId))

        // Get the documents that match the query
        const querySnapshot = await getDocs(reviewQuery)

        if (querySnapshot.empty) {
            throw new Error("No matching review found")
        }

        // Loop through the matching documents (there should typically be only one)
        for (const doc of querySnapshot.docs) {
            const reviewRef = doc.ref // Reference to the document
            await updateDoc(reviewRef, {
                review: updatedReview,
                edited_at: Timestamp.now(), // Update the reviewed_at timestamp
                ...(updatedRating !== undefined && { rating: updatedRating }), // Conditionally update rating
            })
        }

        return true
    } catch (e) {
        throw new Error("Error updating review: " + e.message)
    }
}

export const fetchDeleteReview = async (userId, reviewId) => {
    try {
        // Query para encontrar a review no Firestore
        const reviewQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), where("id_movie", "==", reviewId))

        const querySnapshot = await getDocs(reviewQuery)

        if (!querySnapshot.empty) {
            // Assume que há apenas um documento que corresponde à query
            const docToDelete = querySnapshot.docs[0]
            await deleteDoc(docToDelete.ref)
            return true
        } else {
            throw new Error("Review não encontrada.")
        }
    } catch (error) {
        console.error("Erro ao deletar review:", error)
        throw error
    }
}

export const isFriendCodeUnique = async (code) => {
    const usersQuery = query(collection(db, "users"), where("friendCode", "==", code))
    const snapshot = await getDocs(usersQuery)
    return snapshot.empty // Retorna true se o código for único
}

export const fetchGroupNameById = async (groupId) => {
    try {
        // Reference to the group document
        const groupDocRef = doc(db, "groups", groupId)
        const groupDocSnap = await getDoc(groupDocRef)

        // Check if the group exists
        if (!groupDocSnap.exists()) {
            throw new Error(`Group with ID '${groupId}' not found.`)
        }

        // Return the group name
        const groupData = groupDocSnap.data()
        return groupData.name || null // Return null if 'name' field is missing
    } catch (error) {
        console.error("Error fetching group name:", error.message)
        throw error
    }
}

export const fetchGroupReviews = async (groupId) => {
    try {
        const usersRef = collection(db, "users");
        const userDocs = await getDocs(usersRef);

        const allReviews = [];

        // Obtém os filmes assistidos do grupo
        const groupWatchedMoviesRef = collection(db, "groups", groupId, "watchedMovies");
        const watchedMoviesSnapshot = await getDocs(groupWatchedMoviesRef);
        const watchedMoviesIds = watchedMoviesSnapshot.docs.map((doc) => doc.data().id);

        for (const userDoc of userDocs.docs) {
            const userData = userDoc.data();
            const reviewsRef = collection(userDoc.ref, "reviews");
            const reviewsQuery = query(reviewsRef, where("group", "==", groupId));
            const reviewsSnapshot = await getDocs(reviewsQuery);

            reviewsSnapshot.forEach((reviewDoc) => {
                const reviewData = reviewDoc.data();
                const idMovie = reviewData.id_movie;

                if (watchedMoviesIds.includes(idMovie)) {
                    let reviewedAt = reviewData.reviewed_at;
                    let editedAt = reviewData.edited_at;

                    if (reviewedAt instanceof Timestamp) {
                        reviewedAt = reviewedAt.toDate();
                    }
                    if (editedAt instanceof Timestamp) {
                        editedAt = editedAt.toDate();
                    }

                    allReviews.push({
                        id: reviewDoc.id,
                        ...reviewData,
                        displayName: userData.displayName || "Usuário desconhecido",
                        photoURL: userData.photoURL,
                        reviewed_at: reviewedAt, // Agora mantemos como Date!
                        edited_at: editedAt, // Agora mantemos como Date!
                    });
                }
            });
        }

        // ✅ Agora a ordenação vai funcionar corretamente
        return allReviews.sort((a, b) => b.reviewed_at - a.reviewed_at);
    } catch (error) {
        console.error("Error fetching group reviews:", error.message);
        throw error;
    }
};

