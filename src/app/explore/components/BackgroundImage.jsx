'use client'
import { useContentType } from '@/app/context/contentTypeProvider'
import { getDailyBackground } from '@/app/lib/movieApi'
import { Skeleton } from '@heroui/skeleton'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const BackgroundImage = ({ children }) => {
    const [backgroundImage, setBackGroundImage] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { contentType } = useContentType()
    useEffect(() => {
        const fetchBackground = async () => {
            setBackGroundImage(null)
            setIsLoading(true)
            try {
                const res = await getDailyBackground(contentType)
                setBackGroundImage(res)
            } catch (e) {
                console.error(e)
            }
        }
        fetchBackground()
    }, [contentType])
    return (
        <div className="relative w-full min-h-screen flex flex-col gap-6 items-center pb-6">
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full bg-gray-800" />}
            {backgroundImage && (
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    quality={100}
                    onLoadingComplete={() => setIsLoading(false)}
                    className={`z-0 object-cover object-center transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                />
            )}

            <div className="absolute inset-0 bg-black/70 z-10"></div>

            <div className="relative z-20 w-full flex flex-col items-center">{children}</div>
        </div>
    )
}

export default BackgroundImage
