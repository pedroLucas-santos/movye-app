import { getGroupsList } from "@/app/lib/groupApi"
import CreateGroupButton from "./components/CreateGroupButton"
import GroupList from "./components/GroupList"

// pages/families.js
export default async function Groups({ params }) {
    const { userId } = await params

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-8">Selecione seu Grupo</h1>
            <div className="grid grid-cols-3 gap-8 justify-items-center">
                <GroupList userId={userId} />

                <CreateGroupButton />
            </div>
        </div>
    )
}
