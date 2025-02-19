import NavBar from "@/app/shared/NavBar"
import React from "react"
import Switches from "./components/Switches"
import { getUserSettings } from "@/app/lib/userApi"

const page = async ({ params }) => {
    const { userId } = await params
    const settings = await getUserSettings(userId)
    return (
        <>
            <NavBar />
            <div className="max-w-2xl mx-auto p-6 bg-zinc-900 text-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-4 text-white">Configurações</h1>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2 text-white">Notificações</h2>

                    <Switches settings={settings} userId={userId}/>
                </div>
            </div>
        </>
    )
}

export default page
