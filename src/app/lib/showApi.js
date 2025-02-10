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
        

        // Fetch show details from TheMovieDB API
        const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}?language=en-US`, options)
        const show = await response.json()
        

        // References for Firestore
        const groupRef = doc(db, "groups", groupId) // Group document reference
        const showDocRef = doc(groupRef, "watchedShows", show.name.toString()) // Watched shows collection under the group

        const showDocSnap = await getDoc(showDocRef)

        if (!showDocSnap.exists()) {
            // Update the last watched movie for the group
            await setDoc(groupRef, {
                lastWatchedShow: {
                    genre: show.genres[0]?.name || "Unknown",
                    id: show.id,
                    poster_path: show.poster_path,
                    rating: 0,
                    release_date: show.first_air_date,
                    title: show.name,
                    watched_at: Timestamp.now(),
                },
            }, {merge: true})

            // Create the watched show in the group's watchedMovies collection
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
        // Reference the group document
        const groupDocRef = doc(db, "groups", groupId)
        const groupDoc = await getDoc(groupDocRef)

        if (!groupDoc.exists()) {
            throw new Error(`Group with ID ${groupId} not found.`)
        }

        const groupData = groupDoc.data()

        // Check if the group has a lastWatchedMovie field
        if (!groupData.lastWatchedShow) {
            

            // Default data for a new last watched movie
            const defaultLastWatchedShow = {
                genre: "",
                id: 0,
                poster_path: "",
                rating: 0,
                release_date: "",
                title: "",
                watched_at: Timestamp.now(),
            }

            // Update the group's lastWatchedMovie field
            await setDoc(groupDocRef, { ...groupData, lastWatchedMovie: defaultLastWatchedShow })

            
            return defaultLastWatchedMovie
        }

        // Return the lastWatchedMovie field from the group document
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
        } /* else {
            throw new Error("No posters found")
        } */
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
        } /* else {
            throw new Error("No posters found")
        } */
    } catch (error) {
        throw new Error("Error fetching movie images: " + error.message)
    }
}

export const fetchShowsWatched = async (groupId) => {
    try {
        // Reference the "watchedMovies" subcollection inside the specific group
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
                watched_at: watchedAtDate, // Include the formatted date
            }
        })

        

        // Fetch reviews related to the group
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("group", "==", groupId))
        const reviewsSnapshot = await getDocs(reviewsQuery)
        const reviews = reviewsSnapshot.docs.map((doc) => doc.data())

        

        // Combine movies with their reviews
        const showsWithRatings = shows.map((show) => {
            const showReviews = reviews.filter((review) => review.id_movie === show.id)

            

            // Calculate average rating
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
        //update watched movies review
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
        

        //create movie review
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
            content: contentType
        })
    } catch (e) {
        throw new Error("Error fetching movie review: " + e.message)
    }
}