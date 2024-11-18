import { db } from "../lib/firebase-config"
import { getDocs, collection, updateDoc, doc, Timestamp, getDoc, setDoc, query, orderBy, where, collectionGroup } from "firebase/firestore"

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
        //get the id of the last watched movie
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
        const data = await response.json()

        if (data.posters && data.posters.length > 0) {
            const filteredPosters = data.posters.filter((poster) => poster.iso_639_1 == "en")

            if (filteredPosters.length > 0) {
                const posterPath = filteredPosters[0].file_path
                return `https://image.tmdb.org/t/p/w500${posterPath}` // Return the full URL for the poster
            }
        } else {
            throw new Error("No posters found")
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
                (backdrop) => backdrop.width === 3840 && backdrop.height === 2160 && backdrop.iso_639_1 == null
            )

            if (filteredBackdrops.length > 0) {
                const randomBackdrop = filteredBackdrops[Math.floor(Math.random() * filteredBackdrops.length)]
                const backdropPath = randomBackdrop.file_path
                return `https://image.tmdb.org/t/p/original${backdropPath}`
            }
        } else {
            throw new Error("No posters found")
        }
    } catch (error) {
        throw new Error("Error fetching movie images: " + error.message)
    }
}

export const fetchMovieCard = async (apiKey) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/120/images`, options)
        const data = await response.json()

        /* const id = data.backdrops.findIndex(b => b.file_path === "/atAgkg1ILczZQNDSHCTARPMTQOs.jpg")
        console.log(id) == 91 FOTO BALAAA */

        if (data.backdrops && data.backdrops.length > 0) {
            for (let i = 0; i < data.backdrops.length; i++) {
                const backdropPath = data.backdrops[Math.floor(Math.random() * data.backdrops.length)].file_path
                return `https://image.tmdb.org/t/p/original${backdropPath}` // Return the full URL for the poster
            } // Return the full URL for the poster
        } else {
            throw new Error("No posters found")
        }
    } catch (error) {
        throw new Error("Error fetching movie images: " + error.message)
    }
}

export const fetchSearchedMovieName = async (movie) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}`, options)
        const data = await response.json()

        const snapshot = await getDocs(collection(db, "global/watchedMovies/movies"))
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

export const fetchAddMovie = async (movieId) => {
    try {
        console.log("Fetching add movie")
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
        const movie = await response.json()
        console.log(movie)

        const movieRef = doc(db, "global", "lastWatchedMovie")
        const movieDocRef = doc(db, "global", "watchedMovies", "movies", movie.original_title.toString())

        const movieDocSnap = await getDoc(movieDocRef)

        if (!movieDocSnap.exists()) {
            //update last watched movie
            await updateDoc(movieRef, {
                genre: movie.genres[0].name,
                id: movie.id,
                poster_path: movie.poster_path,
                rating: 0,
                release_date: movie.release_date,
                title: movie.original_title,
                watched_at: Timestamp.now(),
            })

            //create movies watched
            await setDoc(movieDocRef, {
                backdrop_path: movie.backdrop_path,
                genre: movie.genres[0].name,
                id: movie.id,
                poster_path: movie.poster_path,
                rating: 0,
                release_date: movie.release_date,
                title: movie.original_title,
                watched_at: Timestamp.now(),
            })
        }
    } catch (e) {
        throw new Error(e)
    }
}

export const fetchMovieLastWatched = async () => {
    try {
        const movieDocRef = doc(db, "global", "lastWatchedMovie")
        const movieDoc = await getDoc(movieDocRef)

        if (!movieDoc.exists()) {
            console.log("Documento 'lastWatchedMovie' não encontrado. Criando novo documento...")

            // Defina os dados do novo documento
            const newMovieData = {
                genre: "",
                id: 0,
                poster_path: "",
                rating: 0,
                release_date: "",
                title: "",
                watched_at: Timestamp.now(),
            }

            // Cria o novo documento
            await setDoc(movieDocRef, newMovieData)

            console.log("Documento criado com sucesso.")

            return newMovieData
        }

        const movieData = movieDoc.data()

        if (!movieData || !movieData.id || !movieData.title) {
            throw new Error("O filme 'lastWatchedMovie' não tem dados completos no banco de dados.")
        }

        const movieId = movieData.id
        const title = movieData.title

        const posterUrl = await fetchMoviePoster(movieId)
        const backdropUrl = await fetchMovieBackdrop(movieId)

        const lastMovie = {
            id: movieId,
            title: title,
            posterUrl: posterUrl,
            backdropUrl: backdropUrl,
            genre: movieData.genre,
            rating: movieData.rating,
            release_date: movieData.release_date,
            watched_at: movieData.watched_at,
        }

        return lastMovie
    } catch (error) {
        throw new Error("Error fetching last watched movie: " + error.message)
    }
}

export const fetchMoviesWatched = async () => {
    try {
        const movieQuery = query(collection(db, "global", "watchedMovies", "movies"), orderBy("watched_at", "desc"))
        const snapshot = await getDocs(movieQuery)
        const movies = snapshot.docs.map((doc) => doc.data())

        return movies
    } catch (e) {
        throw new Error("Error fetching watched movies: " + e.message)
    }
}

export const fetchMovieReview = async (movieId, newRating, movieSelected, newReview, uid) => {
    try {
        //update watched movies review
        const movieQuery = query(collection(db, "global", "watchedMovies", "movies"), where("id", "==", movieId))
        const snapshot = await getDocs(movieQuery)

        if (!snapshot.empty) {
            snapshot.forEach(async (docSnapshot) => {
                const docRef = doc(db, "global", "watchedMovies", "movies", docSnapshot.id)

                await updateDoc(docRef, { rating: newRating })

                console.log(`Filme ${movieId} atualizado com nova avaliação: ${newRating}`)
            })
        } else {
            console.log("Nenhum documento encontrado com o ID:", movieId)
        }
        const movieDoc = snapshot.docs[0].data()
        console.log(movieDoc)

        //create movie review
        const movieDocRef = doc(db, "users", uid, "reviews", movieSelected.title.toString())

        await setDoc(movieDocRef, {
            id_movie: movieSelected.id,
            rating: newRating,
            review: newReview,
            reviewed_at: Timestamp.now(),
            user_id: uid,
        })
    } catch (e) {
        throw new Error("Error fetching movie review: " + e.message)
    }
}

//PAREI AQUIII
export const fetchUserLastMovieReview = async (lastMovieId) => {
    try {
        console.log(lastMovieId)

        const reviewsQuery = query(collectionGroup(db, "reviews"), where("id_movie", "==", lastMovieId))

        const snapshot = await getDocs(reviewsQuery)

        const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        if (reviews.length === 0) {
            // Nenhuma review encontrada para este filme
            return {
                review: "",
                rating: null,
                reviewed_at: "",
                user: {
                    displayName: "",
                    photoURL: null,
                },
            }
        }

        const latestReview = reviews.sort((a, b) => b.reviewed_at.toMillis() - a.reviewed_at.toMillis())[0]

        let formattedDate = ""
        if (latestReview?.reviewed_at) {
            const timestamp = latestReview.reviewed_at
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

        const userId = latestReview.user_id
        const userDocRef = doc(db, "users", userId)
        const userDoc = await getDoc(userDocRef)

        if (!userDoc.exists()) {
            throw new Error(`Usuário com ID ${userId} não encontrado.`)
        }

        const userData = userDoc.data()
        console.log(userData)

        const userReviews = {
            review: latestReview.review || "",
            rating: latestReview.rating || 0,
            reviewed_at: formattedDate,
            user: {
                displayName: userData.displayName || "",
                photoURL: userData.photoURL || null,
            },
        }

        console.log(userReviews)

        return userReviews
    } catch (e) {
        throw new Error("Error fetching user last movie review: " + e.message)
    }
}
