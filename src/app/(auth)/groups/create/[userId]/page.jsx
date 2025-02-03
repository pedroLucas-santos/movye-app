import NavBar from "@/app/shared/NavBar"
import CreateGroup from "./components/CreateGroup"

const page = async ({ params }) => {
    const { userId } = await params

    return (
        <>
            <div className="relative flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-6 text-white">Criação de Grupo</h1>

                <CreateGroup userId={userId} />
            </div>
        </>
    )
}

export default page
