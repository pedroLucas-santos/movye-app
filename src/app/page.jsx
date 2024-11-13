import MainBanner from "./components/MainBanner"
import MoviesWatched from "./components/MoviesWatched"
import NavBar from "./components/NavBar"
import "./Header.css"
export default function Home() {
    return (
        <main
            id="view"
            className="w-full h-full scroll-smooth overflow-y-auto
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
            <MainBanner/>
            <MoviesWatched/>
        </main>
    )
}
