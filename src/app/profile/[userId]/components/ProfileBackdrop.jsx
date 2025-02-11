"use client"
import { useContentType } from "@/app/context/contentTypeProvider"
import Image from "next/image"
import React from "react"

const ProfileBackdrop = ({user}) => {
    const { contentType } = useContentType()
    const backdropUrl = contentType === 'movie' ? `https://image.tmdb.org/t/p/original${user.favoriteMovie?.backdropPath}` : `https://image.tmdb.org/t/p/original${user.favoriteShow?.backdropPath}`
    return (
        <>
            {contentType === "movie"
                ? user.favoriteMovie?.backdropPath !== null && (
                      <Image src={backdropUrl} alt="Backdrop Image" fill quality={100} className="object-top object-cover" />
                  )
                : user.favoriteShow?.backdropPath !== null && (
                      <Image src={backdropUrl} alt="Backdrop Image" fill quality={100} className="object-top object-cover" />
                  )}
        </>
    )
}

export default ProfileBackdrop
