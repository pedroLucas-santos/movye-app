"use client"
import { useEffect, useState, useRef } from "react"
import { fetchMovieLastWatched, fetchUserLastMovieReview } from "@/app/lib/movieApi"
import { useMovieUpdate } from "@/app/context/movieUpdateProvider"
import NavBar from "@/app/shared/NavBar"
import RenderStars from "@/app/shared/RenderStars"
import { useGroup } from "@/app/context/groupProvider"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContentType } from "@/app/context/contentTypeProvider"
import MovieBanner from "./MovieBanner"
import ShowBanner from "./ShowBanner"

const MainBanner = () => {
    const {contentType, setContentType} = useContentType()

    return (
        <>
            {contentType === 'movie' ? <MovieBanner/> : <ShowBanner/>}
        </>
    )
}

export default MainBanner
