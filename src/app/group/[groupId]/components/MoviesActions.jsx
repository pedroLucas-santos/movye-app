"use client"
import { useDisclosure } from "@heroui/modal"
import React from "react"
import { Tooltip } from "@heroui/tooltip"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/drawer"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import { deleteMovieFromGroup } from "@/app/lib/groupApi"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const MoviesActions = ({ groupId, movieId, movieTitle }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const router = useRouter()
    const deleteMovie = async () => {
        try {
            await deleteMovieFromGroup(groupId, movieId)
            toast.success("Filme excluído com sucesso!")
            router.refresh()
        } catch (err) {
            console.error("Failed to delete movie:", err)
        }
    }
    return (
        <>
            <Dropdown className="dark" shouldBlockScroll={false}>
                <DropdownTrigger>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                    </svg>
                </DropdownTrigger>
                <DropdownMenu onAction={onOpen}>
                    <DropdownItem key="remove" className="text-danger transition-colors" color="danger">
                        Excluir filme
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
                            <DrawerHeader className="flex flex-col gap-1 items-center">Excluir grupo</DrawerHeader>
                            <DrawerBody className="justify-center items-center">
                                <p>Tem certeza que deseja excluir o filme {movieTitle} ?</p>
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
    )
}

export default MoviesActions
