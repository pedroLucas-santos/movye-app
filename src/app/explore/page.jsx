import NavBar from '../shared/NavBar'
import { Suspense } from 'react'
import CardsReviews from './components/CardsReviews'
import './Typing.css'
import TypewriterHeading from './components/TypewriterHeading'
import { getAllPublicReviews } from '../lib/userApi'
import BackgroundImage from './components/BackgroundImage'
import { getDailyBackground } from '../lib/movieApi'

export default async function Page() {
    const reviews = await getAllPublicReviews()

    return (
        <>
            <BackgroundImage>
                <NavBar />
                <div>
                    <TypewriterHeading />
                </div>
                <input className="w-96 p-4 rounded-full" placeholder="Buscar review..." type="text" />

                <CardsReviews reviews={reviews} />
            </BackgroundImage>
        </>
    )
}
