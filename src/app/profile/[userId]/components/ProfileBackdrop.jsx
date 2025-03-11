'use client'
import { useContentType } from '@/app/context/contentTypeProvider'
import { Skeleton } from '@heroui/skeleton'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ProfileBackdrop = ({ user }) => {
    const { contentType } = useContentType()
    const [isLoading, setIsLoading] = useState(true)
    const [backdropUrl, setBackdropUrl] = useState(null)

    useEffect(() => {
        setBackdropUrl(null)
        setIsLoading(true)

        setTimeout(() => {
            contentType === 'movie'
                ? setBackdropUrl(`https://image.tmdb.org/t/p/original${user.favoriteMovie?.backdropPath}`)
                : setBackdropUrl(`https://image.tmdb.org/t/p/original${user.favoriteShow?.backdropPath}`)
        }, 500)
    }, [[], contentType])
    return (
        <>
            {backdropUrl && (
                <Image
                    src={backdropUrl}
                    alt="Backdrop Image"
                    fill
                    quality={100}
                    onLoadingComplete={() => setIsLoading(false)}
                    className={`object-top object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                />
            )}
        </>
    )
}

export default ProfileBackdrop
