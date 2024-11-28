import { db } from "../lib/firebase-config"
import { getDocs, collection, updateDoc, doc, Timestamp, getDoc, setDoc, query, orderBy, where, collectionGroup, limit } from "firebase/firestore"

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

            const newMovieData = {
                genre: "",
                id: 0,
                poster_path: "",
                rating: 0,
                release_date: "",
                title: "",
                watched_at: Timestamp.now(),
            }

            await setDoc(movieDocRef, newMovieData)

            console.log("Documento criado com sucesso.")

            return newMovieData
        }

        const movieData = movieDoc.data()

        /*         if (!movieData || !movieData.id || !movieData.title) {
            throw new Error("O filme 'lastWatchedMovie' não tem dados completos no banco de dados.")
        } */

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
            genre: movieSelected.genre,
        })
    } catch (e) {
        throw new Error("Error fetching movie review: " + e.message)
    }
}

export const fetchUserLastMovieReview = async (lastMovieId) => {
    try {
        console.log(lastMovieId)

        const reviewsQuery = query(collectionGroup(db, "reviews"), where("id_movie", "==", lastMovieId))
        const snapshot = await getDocs(reviewsQuery)

        const reviews = snapshot.docs.map((doc) => {
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

            return {
                id: doc.id,
                review: data.review || "",
                rating: data.rating || 0,
                reviewed_at: formattedDate,
                user_id: data.user_id,
            }
        })

        if (reviews.length === 0) {
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

        const userPromises = reviews.map(async (review) => {
            const userDocRef = doc(db, "users", review.user_id)
            const userDoc = await getDoc(userDocRef)

            if (!userDoc.exists()) {
                throw new Error(`Usuário com ID ${review.user_id} não encontrado.`)
            }

            const userData = userDoc.data()

            return {
                ...review,
                user: {
                    displayName: userData.displayName || "",
                    photoURL: userData.photoURL || null,
                },
            }
        })

        const reviewsWithUser = await Promise.all(userPromises)

        return reviewsWithUser
    } catch (e) {
        throw new Error("Error fetching user last movie review: " + e.message)
    }
}

export const fetchUserReviews = async (userId) => {
    try {
        console.log(userId)
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
        }
    } catch (e) {
        throw new Error("Error fetching user's last movie review: " + e.message)
    }
}

export const fetchReviewsCard = async (userId) => {
    try {
        const reviewsQuery = query(collectionGroup(db, "reviews"), where("user_id", "==", userId), orderBy("reviewed_at", "desc"))

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

                return {
                    id: doc.id,
                    review: data.review || "",
                    rating: data.rating || 0,
                    reviewed_at: formattedDate,
                    genre: data.genre || "",
                    posterUrl: poster_url || null,
                }
            })
        )

        return reviews
    } catch (e) {
        throw new Error("Error fetching reviews card: " + e.message)
    }
}
