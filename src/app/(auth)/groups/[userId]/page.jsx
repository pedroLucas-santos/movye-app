import { getGroupsList } from "@/app/lib/groupApi"
import CreateGroupButton from "./components/CreateGroupButton"
import GroupList from "./components/GroupList"
import { Suspense } from "react"

// pages/families.js
export default async function Groups({ params }) {
    const { userId } = await params
    const groups = [
        { id: 1, name: "Grupo A", avatar: "/avatar1.png" },
        { id: 2, name: "Grupo B", avatar: "/avatar2.png" },
        { id: 3, name: "Grupo C", avatar: "/avatar2.png" },
        // Adicione mais famílias aqui
    ]

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-8">Selecione seu Grupo</h1>
            <div className="grid grid-cols-4 gap-8">
                <Suspense>
                    <GroupList userId={userId} />
                </Suspense>

                <CreateGroupButton />
            </div>
        </div>
    )
}
