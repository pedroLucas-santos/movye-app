const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MTJhMzAzMGExODRhYTgzMTg1MWY5MWNmMTBjNmI1ZCIsIm5iZiI6MTczMTQyNDEyMC42NTUwNDg2LCJzdWIiOiI2NzMzNmU4ZDEzYmVhZjQ2NWI3M2M5NDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4ZA9UGy74W6Avpvd7CVsuj5tZkBaX6QbptP2W-DEWNM",
    },
}

const searchMovie = async (movie, apiKey) => {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}`, apiKey)
        .then((res) => res.json())
        /* .then((res) => console.log(res)) */
        .catch((err) => console.error(err))
}

const fetchMoviePoster = async (apiKey) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/120/images`, options)
        const data = await response.json()

        if (data.posters && data.posters.length > 0) {
            const posterPath = data.posters[0].file_path
            return `https://image.tmdb.org/t/p/w500${posterPath}` // Return the full URL for the poster
        } else {
            throw new Error("No posters found")
        }
    } catch (error) {
        throw new Error("Error fetching movie images: " + error.message)
    }
}

const fetchMovieBackdrop = async (apiKey) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/120/images`, options)
        const data = await response.json()
        console.log(data)

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

const fetchMovieCard = async (apiKey) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/120/images`, options)
        const data = await response.json()
        console.log(data)

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

export { options, searchMovie, fetchMoviePoster, fetchMovieBackdrop, fetchMovieCard }
