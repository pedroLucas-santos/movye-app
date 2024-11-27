const ReviewsCard = () => {
    const reviews = [
        {
            id: 1,
            movieTitle: "Inception",
            posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
            rating: 5,
            review: "A brilliant masterpiece with an intricate plot.",
            reviewedAt: "25 de novembro de 2024",
            genre: "Sci-Fi",
        },
        {
            id: 2,
            movieTitle: "The Dark Knight",
            posterUrl: "https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
            rating: 4,
            review: "A gripping and intense superhero movie.",
            reviewedAt: "20 de novembro de 2024",
            genre: "Action",
        },
        {
            id: 2,
            movieTitle: "The Dark Knight",
            posterUrl: "https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
            rating: 4,
            review: "A gripping and intense superhero movie.",
            reviewedAt: "20 de novembro de 2024",
            genre: "Action",
        },
        {
            id: 2,
            movieTitle: "The Dark Knight",
            posterUrl: "https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
            rating: 4,
            review: "A gripping and intense superhero movie.",
            reviewedAt: "20 de novembro de 2024",
            genre: "Action",
        },
        {
            id: 2,
            movieTitle: "The Dark Knight",
            posterUrl: "https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
            rating: 4,
            review: "A gripping and intense superhero movie.",
            reviewedAt: "20 de novembro de 2024",
            genre: "Action",
        },
        {
            id: 2,
            movieTitle: "The Dark Knight",
            posterUrl: "https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
            rating: 4,
            review: "A gripping and intense superhero movie.",
            reviewedAt: "20 de novembro de 2024",
            genre: "Action",
        },
        {
            id: 2,
            movieTitle: "The Dark Knight",
            posterUrl: "https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
            rating: 4,
            review: "A gripping and intense superhero movie.",
            reviewedAt: "20 de novembro de 2024",
            genre: "Action",
        },
    ];
    return (
        <div className="w-full h-full overflow-y-auto flex items-center justify-center bg-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                    >
                        <img src={review.posterUrl} alt={review.movieTitle} className="w-full h-64 object-cover" />
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-bold">{review.movieTitle}</h3>
                            <span className="text-sm text-gray-400">{review.genre}</span>
                            <p className="text-sm">{review.review}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm bg-cyan-700 text-white px-2 py-1 rounded-lg">⭐ {review.rating}/5</span>
                                <span className="text-xs text-gray-400">{review.reviewedAt}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReviewsCard
