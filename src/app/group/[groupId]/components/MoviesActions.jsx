"use client"
import { useDisclosure } from "@heroui/modal"
import React from "react"
import { Tooltip } from "@heroui/tooltip"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/drawer"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { deleteMovieFromGroup } from "@/app/lib/groupApi"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/auth-context"
import { useContentType } from "@/app/context/contentTypeProvider"
import { deleteShowFromGroup } from "@/app/lib/showApi"

const MoviesActions = ({ groupId, movieId, movieTitle, groupCreatorId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const router = useRouter()
    const { user } = useAuth()
    const {contentType} = useContentType()

    const deleteMovie = async () => {
        try {
            if(contentType === 'movie'){
                await deleteMovieFromGroup(groupId, movieId)
                toast.success("Filme excluído com sucesso!")
            } else {
                await deleteShowFromGroup(groupId, movieId)
                toast.success("Série excluída com sucesso!")
            }
            
            router.refresh()
        } catch (err) {
            console.error("Failed to delete movie/show:", err)
        }
    }
    return (
        <>
            {user?.uid === groupCreatorId && (
                <>
                    <Dropdown className="dark" shouldBlockScroll={false}>
                        <DropdownTrigger>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                            </svg>
                        </DropdownTrigger>
                        <DropdownMenu onAction={onOpen}>
                            <DropdownItem key="remove" className="text-danger transition-colors" color="danger">
                               {contentType === 'movie' ? 'Excluir filme' : 'Excluir série'}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Drawer
                        className="dark"
                        placement="bottom"
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        shouldBlockScroll={false}
                    >
                        <DrawerContent>
                            {(onClose) => (
                                <>
                                    <DrawerHeader className="flex flex-col gap-1 items-center">{contentType === 'movie' ? 'Excluir filme' : 'Excluir série'}</DrawerHeader>
                                    <DrawerBody className="justify-center items-center">
                                        <p>{contentType === 'movie' ? `Tem certeza que deseja excluir o filme ${movieTitle} ?` : `Tem certeza que deseja excluir a série ${movieTitle} ?`}</p>
                                    </DrawerBody>
                                    <DrawerFooter className="justify-center">
                                        <Tooltip content="Essa ação é irreversível!" color="danger" closeDelay={100}>
                                            <button
                                                className="px-4 py-2 mt-4 bg-transparent border-2 border-danger text-danger rounded-md shadow-md hover:bg-danger-100 transition-colors"
                                                onClick={() => {
                                                    deleteMovie()
                                                    onClose()
                                                }}
                                            >
                                                Sim
                                            </button>
                                        </Tooltip>
                                        <button
                                            className="px-4 py-2 mt-4 bg-transparent border-2 border-secondary-dark text-secondary-dark rounded-md shadow-md hover:bg-zinc-400 transition-colors"
                                            onClick={onClose}
                                        >
                                            Não
                                        </button>
                                    </DrawerFooter>
                                </>
                            )}
                        </DrawerContent>
                    </Drawer>
                </>
            )}
        </>
    )
}

export default MoviesActions
