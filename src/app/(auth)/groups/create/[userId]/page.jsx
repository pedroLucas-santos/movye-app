import NavBar from "@/app/shared/NavBar"
import CreateGroup from "./components/CreateGroup"
import ToastCustom from "@/app/dashboard/components/ToastCustom"

const page = async ({ params }) => {
    const { userId } = await params

    return (
        <>
            <div className="relative flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-6">Criação de Grupo</h1>

                <CreateGroup userId={userId} />
            </div>
            <ToastCustom />
        </>
    )
}

export default page
