import { collection, collectionGroup, doc, getCountFromServer, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '@/app/lib/firebase-config' // Replace with your Firebase setup

export const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTJhMzAzMGExODRhYTgzMTg1MWY5MWNmMTBjNmI1ZCIsIm5iZiI6MTczMTQyNDEyMC42NTUwNDg2LCJzdWIiOiI2NzMzNmU4ZDEzYmVhZjQ2NWI3M2M5NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4ZA9UGy74W6Avpvd7CVsuj5tZkBaX6QbptP2W-DEWNM'
    }
}

export const getUserById = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
            return { id: userId, ...userDoc.data() }
        }
        return null
    } catch (error) {
        console.error('Error fetching user data:', error)
        return null
    }
}

export const getUserReviews = async (userId, contentType) => {
    try {
        const reviewsQuery = query(collectionGroup(db, 'reviews'), where('user_id', '==', userId), where('content', '==', contentType))

        const snapshot = await getCountFromServer(reviewsQuery)

        return snapshot.data().count
    } catch (err) {
        console.error('Error fetching user reviews:', err)
        throw err
    }
}

export const getUserAvgReviews = async (userId, contentType) => {
    try {
        const reviewsQuery = query(collectionGroup(db, 'reviews'), where('user_id', '==', userId), where('content', '==', contentType))

        const querySnapshot = await getDocs(reviewsQuery)

        let totalReviews = 0
        let reviewCount = 0

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            if (data.rating) {
                totalReviews += data.rating
                reviewCount += 1
            }
        })

        const average = reviewCount > 0 ? totalReviews / reviewCount : 0

        const roundedAvg = Math.ceil(average)

        return roundedAvg
    } catch (err) {
        console.error('Error fetching user average reviews:', err)
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
        console.error('Error fetching favorite movie:', err)
        throw err
    }
}

export const getMovieBackdrop = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
        const data = await response.json()
        return data.backdrops
    } catch (error) {
        console.error('Error fetching movie images:', error.message)
        throw error
    }
}

export const saveProfileEdit = async (userId, favoriteMovie, favoriteShow, backdropPath, bio, contentType) => {
    try {
        const userDocRef = doc(db, 'users', userId)
        const docSnapshot = await getDoc(userDocRef)

        if (!docSnapshot.exists()) {
            await setDoc(userDocRef, {
                bio: '',
                favoriteMovie: {
                    title: '',
                    id: '',
                    backdropPath: ''
                },
                favoriteShow: {
                    name: '',
                    id: '',
                    backdropPath: ''
                }
            })
        }

        if (contentType === 'movie') {
            if (favoriteMovie) {
                await setDoc(
                    userDocRef,
                    {
                        bio: bio || '',
                        favoriteMovie: {
                            title: favoriteMovie.title,
                            id: favoriteMovie.id,
                            backdropPath: backdropPath
                        }
                    },
                    { merge: true }
                )
            } else {
                await updateDoc(
                    userDocRef,
                    {
                        bio: bio || ''
                    },
                    { merge: true }
                )
            }
        }

        if (contentType === 'tv') {
            if (favoriteShow) {
                await setDoc(
                    userDocRef,
                    {
                        bio: bio || '',
                        favoriteShow: {
                            name: favoriteShow.name,
                            id: favoriteShow.id,
                            backdropPath: backdropPath
                        }
                    },
                    { merge: true }
                )
            } else {
                await updateDoc(
                    userDocRef,
                    {
                        bio: bio || ''
                    },
                    { merge: true }
                )
            }
        }
    } catch (err) {
        console.error('Error saving favorite movie:', err)
        throw err
    }
}

export const getUserSettings = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId)
        const docSnapshot = await getDoc(userDocRef)

        if (!docSnapshot.exists()) {
            throw new Error(`User document (${userId}) does not exist`)
        }

        return docSnapshot.data()?.settings || {}
    } catch (err) {
        console.error('Error fetching user settings:', err)
        throw err
    }
}

export const saveUserSettings = async (userId, settings) => {
    try {
        const userDocRef = doc(db, 'users', userId)
        await updateDoc(userDocRef, { settings })
    } catch (err) {
        console.error('Error saving user settings:', err)
        throw err
    }
}

export const getAllPublicReviews = async () => {
    try {
        const usersRef = collection(db, 'users')
        const userDocs = await getDocs(usersRef)

        let allReviews = []
        let counter = 0

        for (const userDoc of userDocs.docs) {
            const userSettings = await getUserSettings(userDoc.id)

            if (userSettings.publicReviews) {
                const reviewRef = collection(db, 'users', userDoc.id, 'reviews')
                const reviewsSnapshot = await getDocs(reviewRef)

                reviewsSnapshot.forEach((review) => {
                    const reviewData = review.data()

                    let formattedDate = ''
                    let editedFormatted = ''
                    let reviewedAtTimestamp = null

                    if (reviewData.reviewed_at && reviewData.reviewed_at.toDate) {
                        reviewedAtTimestamp = reviewData.reviewed_at.toDate()
                        formattedDate = reviewedAtTimestamp.toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                    }

                    if (reviewData.edited_at) {
                        editedFormatted = reviewData.edited_at.toDate().toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })
                    }

                    allReviews.push({
                        id: review.id,
                        keyId: counter++,
                        user_id: userDoc.id,
                        displayName: userDoc.data().displayName,
                        photoURL: userDoc.data().photoURL,
                        ...review.data(),
                        backdrop_path: `https://image.tmdb.org/t/p/original${review.data().backdrop_path}`,
                        reviewed_at: formattedDate,
                        reviewed_at_timestamp: reviewedAtTimestamp, // Mantemos o timestamp para ordenar corretamente
                        edited_at: editedFormatted
                    })
                })
            }
        }

        // Ordena as reviews do mais recente para o mais antigo
        allReviews.sort((a, b) => b.reviewed_at_timestamp - a.reviewed_at_timestamp)

        return allReviews
    } catch (e) {
        console.error('Error fetching all public reviews:', e.message)
        throw e
    }
}

