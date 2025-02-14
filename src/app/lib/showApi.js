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
    deleteField,
} from "firebase/firestore"
import { fetchGroupNameById } from "./movieApi"

export const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTJhMzAzMGExODRhYTgzMTg1MWY5MWNmMTBjNmI1ZCIsIm5iZiI6MTczMTQyNDEyMC42NTUwNDg2LCJzdWIiOiI2NzMzNmU4ZDEzYmVhZjQ2NWI3M2M5NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4ZA9UGy74W6Avpvd7CVsuj5tZkBaX6QbptP2W-DEWNM",
    },
}

export const fetchSearchedShowName = async (show, groupId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${show}`, options)
        const data = await response.json()

        const snapshot = await getDocs(collection(db, `groups/${groupId}/watchedShows`))
        const watchedShows = snapshot.docs.map((doc) => doc.id)

        if (data.results && data.results.length > 0) {
            const filteredNotWatched = data.results.filter((notWatched) => !watchedShows.includes(notWatched.name))
            return filteredNotWatched
        } else {
            throw new Error("No shows found")
        }
    } catch (error) {
        throw new Error("Error fetching show name: " + error.message)
    }
}

export const fetchAddShow = async (showId, groupId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}?language=en-US`, options)
        const show = await response.json()

        const groupRef = doc(db, "groups", groupId)
        const showDocRef = doc(groupRef, "watchedShows", show.name.toString())

        const showDocSnap = await getDoc(showDocRef)

        if (!showDocSnap.exists()) {
            await setDoc(
                groupRef,
                {
                    lastWatchedShow: {
                        genre: show.genres[0]?.name || "Unknown",
                        id: show.id,
                        poster_path: show.poster_path,
                        rating: 0,
                        release_date: show.first_air_date,
                        title: show.name,
                        watched_at: Timestamp.now(),
                    },
                },
                { merge: true }
            )

            await setDoc(showDocRef, {
                backdrop_path: show.backdrop_path,
                genre: show.genres[0]?.name || "Unknown",
                id: show.id,
                poster_path: show.poster_path,
                rating: 0,
                release_date: show.first_air_date,
                title: show.name,
                watched_at: Timestamp.now(),
            })
        }
    } catch (e) {
        console.error("Error in fetchAddShow:", e)
        throw new Error(e.message)
    }
}

export const fetchShowLastWatched = async (groupId) => {
    try {
        const groupDocRef = doc(db, "groups", groupId)
        const groupDoc = await getDoc(groupDocRef)

        if (!groupDoc.exists()) {
            throw new Error(`Group with ID ${groupId} not found.`)
        }

        const groupData = groupDoc.data()

        if (!groupData.lastWatchedShow) {
            const defaultLastWatchedShow = {
                genre: "",
                id: 0,
                poster_path: "",
                rating: 0,
                release_date: "",
                title: "",
                watched_at: Timestamp.now(),
            }

            await setDoc(groupDocRef, { ...groupData, lastWatchedShow: defaultLastWatchedShow })

            return defaultLastWatchedShow
        }

        const lastWatchedShow = groupData.lastWatchedShow

        return {
            ...lastWatchedShow,
            posterUrl: await fetchShowPoster(lastWatchedShow.id),
            backdropUrl: await fetchShowBackdrop(lastWatchedShow.id),
        }
    } catch (error) {
        throw new Error("Error fetching last watched movie: " + error.message)
    }
}

export const fetchShowPoster = async (showId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}/images`, options)
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

export const fetchShowBackdrop = async (showId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}/images`, options)
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
        }
    } catch (error) {
        throw new Error("Error fetching movie images: " + error.message)
    }
}

export const fetchShowsWatched = async (groupId) => {
    try {
        const watchedShowsQuery = query(collection(db, "groups", groupId, "watchedShows"), orderBy("watched_at", "desc"))
        const watchedShowsSnapshot = await getDocs(watchedShowsQuery)
        const shows = watchedShowsSnapshot.docs.map((doc) => {
            const showData = doc.data()

            const watchedAtDate =
                showData.watched_at instanceof Timestamp
                    ? showData.watched_at
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
                ...showData,
                watched_at: watchedAtDate,
            }
        })

        const reviewsQuery = query(collectionGroup(db, "reviews"), where("group", "==", groupId))
        const reviewsSnapshot = await getDocs(reviewsQuery)
        const reviews = reviewsSnapshot.docs.map((doc) => doc.data())

        const showsWithRatings = shows.map((show) => {
            const showReviews = reviews.filter((review) => review.id_movie === show.id)

            const totalReviews = showReviews.length
            const averageRating = totalReviews > 0 ? showReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews : 0

            return {
                ...show,
                averageRating,
            }
        })

        return showsWithRatings
    } catch (e) {
        throw new Error("Error fetching watched movies with ratings: " + e.message)
    }
}

export const fetchShowReview = async (showId, newRating, showSelected, newReview, uid, groupId, contentType) => {
    try {
        const showQuery = query(collection(db, "groups", groupId, "watchedShows"), where("id", "==", showId))
        const snapshot = await getDocs(showQuery)

        if (!snapshot.empty) {
            snapshot.forEach(async (docSnapshot) => {
                const docRef = doc(db, "groups", groupId, "watchedShows", docSnapshot.id)

                await updateDoc(docRef, { rating: newRating })
            })
        } else {
        }
        const movieDoc = snapshot.docs[0].data()

        const showDocRef = doc(db, "users", uid, "reviews", showSelected.title.toString())

        await setDoc(showDocRef, {
            id_movie: showSelected.id,
            rating: newRating,
            review: newReview,
            reviewed_at: Timestamp.now(),
            user_id: uid,
            genre: showSelected.genre,
            title: showSelected.title,
            backdrop_path: showSelected.backdrop_path,
            group: groupId,
            groupName: await fetchGroupNameById(groupId),
            content: contentType,
        })
    } catch (e) {
        throw new Error("Error fetching movie review: " + e.message)
    }
}

export const searchFavoriteShow = async (show) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/tv?query=${show}`, options)
        const data = await res.json()

        const filteredShows = data.results.filter((s) => s.poster_path)

        return filteredShows
    } catch (err) {
        console.error("Error fetching favorite show:", err)
        throw err
    }
}

export const getShowBackdrop = async (showId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}/images`, options)
        const data = await response.json()
        return data.backdrops
    } catch (error) {
        console.error("Error fetching show images:", error.message)
        throw error
    }
}

export const fetchShowsGroupReviews = async (groupId) => {
    try {
        const usersRef = collection(db, "users")
        const userDocs = await getDocs(usersRef)

        const allReviews = []

        const groupWatchedShowsRef = collection(db, "groups", groupId, "watchedShows")
        const watchedShowsSnapshot = await getDocs(groupWatchedShowsRef)
        const watchedShowsIds = watchedShowsSnapshot.docs.map((doc) => doc.data().id)

        for (const userDoc of userDocs.docs) {
            const userData = userDoc.data()
            const reviewsRef = collection(userDoc.ref, "reviews")
            const reviewsQuery = query(reviewsRef, where("group", "==", groupId))
            const reviewsSnapshot = await getDocs(reviewsQuery)

            reviewsSnapshot.forEach((reviewDoc) => {
                const reviewData = reviewDoc.data()
                const idMovie = reviewData.id_movie

                if (watchedShowsIds.includes(idMovie)) {
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

export const deleteShowFromGroup = async (groupId, showId) => {
    try {
        if (!groupId || !showId) {
            throw new Error("Missing groupId or showId")
        }

        const showRef = doc(db, "groups", groupId, "watchedShows", showId)

        await deleteDoc(showRef)

        const watchedShowsRef = collection(db, "groups", groupId, "watchedShows")
        const watchedShowsSnapshot = await getDocs(watchedShowsRef)

        const groupRef = doc(db, "groups", groupId)

        if (watchedShowsSnapshot.empty) {
            await updateDoc(groupRef, {
                lastWatchedShow: deleteField(),
            })
        } else {
            const latestShow = watchedShowsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.watched_at - a.watched_at)[0]
            await updateDoc(groupRef, {
                lastWatchedMovie: latestShow,
            })
        }
    } catch (e) {
        console.error("Error deleting show from group:", e)
        throw e
    }
}
