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
import { createNotification, deleteNotification } from "./notificationApi"

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
        }
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
                (backdrop) => backdrop.width >= 1920 && backdrop.height >= 1080 && backdrop.iso_639_1 == null
            )

            if (filteredBackdrops.length > 0) {
                const randomBackdrop = filteredBackdrops[Math.floor(Math.random() * filteredBackdrops.length)]
                const backdropPath = randomBackdrop.file_path
                return `https://image.tmdb.org/t/p/original${backdropPath}`
            }
        }
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

export const fetchAddMovie = async (sender, movieId, groupId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
        const movie = await response.json()

        const groupRef = doc(db, "groups", groupId)
        const movieDocRef = doc(groupRef, "watchedMovies", movie.original_title.toString())

        const movieDocSnap = await getDoc(movieDocRef)

        if (!movieDocSnap.exists()) {
            await updateDoc(groupRef, {
                lastWatchedMovie: {
                    genre: movie.genres[0]?.name || "Unknown",
                    id: movie.id,
                    poster_path: movie.poster_path,
                    rating: 0,
                    release_date: movie.release_date,
                    title: movie.original_title,
                    watched_at: Timestamp.now(),
                    watcherId: sender.uid
                },
            })

            await setDoc(movieDocRef, {
                backdrop_path: movie.backdrop_path,
                genre: movie.genres[0]?.name || "Unknown",
                id: movie.id,
                poster_path: movie.poster_path,
                rating: 0,
                release_date: movie.release_date,
                title: movie.original_title,
                watched_at: Timestamp.now(),
                watcherId: sender.uid
            })

            const groupSnap = await getDoc(groupRef)
            if (groupSnap.exists()) {
                const group = groupSnap.data()
                const members = group.members || []

                for (const memberId of members) {
                    if (memberId !== sender.uid) {
                        await createNotification(
                            {
                                sender: sender,
                                receiverId: memberId,
                                type: "group-watched",
                                message: `adicionou o filme **${movie.original_title}** ao grupo **${group.name}**`,
                                additionalData: {
                                    watchId: movie.id,
                                    watchTitle: movie.original_title,
                                    watchBackdropUrl: movie.backdrop_path,
                                    groupId: groupId,
                                    groupName: group.name,
                                },
                            },
                            "movie"
                        )
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error in fetchAddMovie:", e)
        throw new Error(e.message)
    }
}

export const fetchMovieLastWatched = async (groupId) => {
    try {
        const groupDocRef = doc(db, "groups", groupId)
        const groupDoc = await getDoc(groupDocRef)

        if (!groupDoc.exists()) {
            throw new Error(`Group with ID ${groupId} not found.`)
        }

        const groupData = groupDoc.data()

        if (!groupData.lastWatchedMovie) {
            const defaultLastWatchedMovie = {
                genre: "",
                id: 0,
                poster_path: "",
                rating: 0,
                release_date: "",
                title: "",
                watched_at: Timestamp.now(),
            }

            await setDoc(groupDocRef, { ...groupData, lastWatchedMovie: defaultLastWatchedMovie })

            return defaultLastWatchedMovie
        }

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
                watched_at: watchedAtDate,
            }
        })

        const reviewsQuery = query(collectionGroup(db, "reviews"), where("group", "==", groupId))
        const reviewsSnapshot = await getDocs(reviewsQuery)
        const reviews = reviewsSnapshot.docs.map((doc) => doc.data())

        const moviesWithRatings = movies.map((movie) => {
            const movieReviews = reviews.filter((review) => review.id_movie === movie.id)

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

export const fetchMovieReview = async (sender, movieId, newRating, movieSelected, newReview, uid, groupId, contentType) => {
    try {
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
            content: contentType,
        })

        const groupRef = doc(db, "groups", groupId)
        const userRef = doc(db, "users", sender.uid)

        const groupSnap = await getDoc(groupRef)
        const userSnap = await getDoc(userRef)

        if (groupSnap.exists() && userSnap.exists()) {
            const group = groupSnap.data()
            const members = group.members || []

            const friendsSnapshot = await getDocs(collection(userRef, "friends"))
            const friends = friendsSnapshot.docs.map((doc) => doc.id)

            for (const memberId of members) {
                if (memberId !== sender.uid) {
                    await createNotification(
                        {
                            sender: sender,
                            receiverId: memberId,
                            type: "review",
                            message: `fez uma nova review para o filme **${movieSelected.title}**`,
                            additionalData: {
                                watchId: movieSelected.id,
                                watchTitle: movieSelected.title,
                                watchBackdropUrl: movieSelected.backdrop_path,
                                groupId: groupId,
                                groupName: group.name,
                            },
                        },
                        "movie"
                    )
                }
            }

            for (const friendId of friends) {
                if (friendId !== sender.uid) {
                    await createNotification(
                        {
                            sender: sender,
                            receiverId: friendId,
                            type: "review",
                            message: `fez uma nova review para o filme **${movieSelected.title}**`,
                            additionalData: {
                                watchId: movieSelected.id,
                                watchTitle: movieSelected.title,
                                watchBackdropUrl: movieSelected.backdrop_path,
                                groupId: groupId,
                                groupName: group.name,
                            },
                        },
                        "movie"
                    )
                }
            }
        }
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
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId))
        const snapshot = await getDocs(reviewsQuery)

        const reviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        return reviews
    } catch (error) {
        console.error("Erro ao buscar reviews no Firestore:", error)
        throw error
    }
}

export const fetchLastReviewUser = async (userId, contentType) => {
    try {
        const reviewsQuery = query(
            collectionGroup(db, "reviews"),
            where("user_id", "==", userId),
            where("content", "==", contentType),
            orderBy("reviewed_at", "desc")
        )

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
                mostViewedGenre: "",
                totalReviews: 0,
                averageRating: 0,
                group: "",
                content: "",
            }
        }

        const genreCounts = {}
        let lastReview = null
        let totalReviews = 0
        let totalRating = 0

        snapshot.docs.forEach((doc, index) => {
            const data = doc.data()
            totalReviews++

            if (data.rating) {
                totalRating += data.rating
            }

            if (data.genre) {
                genreCounts[data.genre] = (genreCounts[data.genre] || 0) + 1
            }

            if (index === 0) {
                lastReview = {
                    id: doc.id,
                    ...data,
                }
            }
        })

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
            mostViewedGenre: mostViewedGenre,
            totalReviews: totalReviews,
            averageRating: averageRating,
            ...userData,
        }
    } catch (e) {
        throw new Error("Error fetching user's last movie review: " + e.message)
    }
}

export const fetchReviewsCard = async (userId, contentType) => {
    try {
        const reviewsQuery = query(
            collectionGroup(db, "reviews"),
            where("user_id", "==", userId),
            where("content", "==", contentType),
            orderBy("reviewed_at", "desc")
        )

        const snapshot = await getDocs(reviewsQuery)

        if (snapshot.empty) {
            return []
        }

        const reviews = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data()
                let formattedDate = ""

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

                let poster_url

                if (contentType === "movie") {
                    poster_url = await fetchMoviePoster(data.id_movie)
                } else {
                    poster_url = await fetchShowPoster(data.id_movie)
                }

                return {
                    id: doc.id,
                    id_movie: data.id_movie || "",
                    review: data.review || "",
                    rating: data.rating || 0,
                    reviewed_at: formattedDate,
                    genre: data.genre || "",
                    posterUrl: poster_url || null,
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
        const reviewQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), where("id_movie", "==", reviewId))

        const querySnapshot = await getDocs(reviewQuery)

        if (querySnapshot.empty) {
            throw new Error("No matching review found")
        }

        for (const doc of querySnapshot.docs) {
            const reviewRef = doc.ref
            await updateDoc(reviewRef, {
                review: updatedReview,
                edited_at: Timestamp.now(),
                ...(updatedRating !== undefined && { rating: updatedRating }),
            })
        }

        return true
    } catch (e) {
        throw new Error("Error updating review: " + e.message)
    }
}

export const fetchDeleteReview = async (userId, reviewId) => {
    try {
        const reviewQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), where("id_movie", "==", reviewId))

        const querySnapshot = await getDocs(reviewQuery)

        if (!querySnapshot.empty) {
            const docToDelete = querySnapshot.docs[0]
            await deleteDoc(docToDelete.ref)
            await deleteNotification(userId, reviewId)
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
    return snapshot.empty
}

export const fetchGroupNameById = async (groupId) => {
    try {
        const groupDocRef = doc(db, "groups", groupId)
        const groupDocSnap = await getDoc(groupDocRef)

        if (!groupDocSnap.exists()) {
            throw new Error(`Group with ID '${groupId}' not found.`)
        }

        const groupData = groupDocSnap.data()
        return groupData.name || null
    } catch (error) {
        console.error("Error fetching group name:", error.message)
        throw error
    }
}

export const fetchGroupReviews = async (groupId) => {
    try {
        const usersRef = collection(db, "users")
        const userDocs = await getDocs(usersRef)

        const allReviews = []

        const groupWatchedMoviesRef = collection(db, "groups", groupId, "watchedMovies")
        const watchedMoviesSnapshot = await getDocs(groupWatchedMoviesRef)
        const watchedMoviesIds = watchedMoviesSnapshot.docs.map((doc) => doc.data().id)

        for (const userDoc of userDocs.docs) {
            const userData = userDoc.data()
            const reviewsRef = collection(userDoc.ref, "reviews")
            const reviewsQuery = query(reviewsRef, where("group", "==", groupId))
            const reviewsSnapshot = await getDocs(reviewsQuery)

            reviewsSnapshot.forEach((reviewDoc) => {
                const reviewData = reviewDoc.data()
                const idMovie = reviewData.id_movie

                if (watchedMoviesIds.includes(idMovie)) {
                    let reviewedAt = reviewData.reviewed_at
                    let editedAt = reviewData.edited_at

                    if (reviewedAt instanceof Timestamp) {
                        reviewedAt = reviewedAt.toDate()
                    }
                    if (editedAt instanceof Timestamp) {
                        editedAt = editedAt.toDate()
                    }

                    allReviews.push({
                        id: reviewDoc.id,
                        ...reviewData,
                        displayName: userData.displayName || "Usuário desconhecido",
                        photoURL: userData.photoURL,
                        reviewed_at: reviewedAt,
                        edited_at: editedAt,
                    })
                }
            })
        }

        return allReviews.sort((a, b) => b.reviewed_at - a.reviewed_at)
    } catch (error) {
        console.error("Error fetching group reviews:", error.message)
        throw error
    }
}
