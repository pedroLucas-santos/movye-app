import { redirect } from "next/navigation"
import MainBanner from "./dashboard/components/MainBanner"
import MoviesWatched from "./dashboard/components/MoviesWatched"

import "./Header.css"
export default function Home() {
    redirect('./(auth)/login')
}
