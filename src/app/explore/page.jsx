import NavBar from '../shared/NavBar'
import { Suspense } from 'react'
import CardsReviews from './components/CardsReviews'
import './Typing.css'
import TypewriterHeading from './components/TypewriterHeading'
import { getAllPublicReviews} from '../lib/userApi'
import BackgroundImage from './components/BackgroundImage'

export const revalidate = 10

export default async function Page() {
    const reviews = await getAllPublicReviews()

    return (
        <>
            <BackgroundImage>
                <NavBar />
                <div className='mb-2'>
                    <TypewriterHeading />
                </div>

                <CardsReviews reviews={reviews}/>
            </BackgroundImage>
        </>
    )
}
