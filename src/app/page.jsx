import { redirect } from "next/navigation"

import "./Header.css"
export default function Home() {
    redirect('./login')
}
