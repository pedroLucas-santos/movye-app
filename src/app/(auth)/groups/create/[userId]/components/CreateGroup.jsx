"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { createNewGroup } from "@/app/lib/groupApi"

export default function CreateGroup({ userId }) {
    const [groupName, setGroupName] = useState("")
    const [groupImage, setGroupImage] = useState(null)
    const [file, setFile] = useState(null)
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFile(reader.result)
            }
            reader.readAsDataURL(selectedFile)

            setGroupImage(selectedFile)
        }
    }

    const createGroup = async () => {
        if (!groupName) {
            toast.error("Por favor, preencha o nome do grupo!")
            return
        }

        try {
            setLoading(true)
            await createNewGroup(groupName, groupImage, userId)
            toast.success("Grupo criado com sucesso!")
            setLoading(false)

            setTimeout(() => {
                router.push(`/groups/${userId}`)
            }, 2000)
        } catch (error) {
            toast.error("Erro ao criar o grupo. Tente novamente.")
            console.error("Erro no createGroup:", error.message)
        }
    }

    return (
        <>
            <div className="mb-6 w-full max-w-sm flex flex-col justify-center items-center gap-4">
                <div className="mb-6">
                    <label
                        htmlFor="upload-image"
                        className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-400 cursor-pointer"
                    >
                        {file ? (
                            <img src={file} alt="Pré-visualização do avatar do grupo" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-gray-400">Upload</span>
                        )}
                    </label>
                </div>
                <input id="upload-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Nome do Grupo"
                    className="w-full px-4 py-2 border bg-secondary-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                />

                <button onClick={createGroup} disabled={loading} className='px-6 py-2 bg-secondary-dark text-white rounded-md hover:bg-zinc-800 transition'>
                    Criar Grupo
                </button>
            </div>
        </>
    )
}
