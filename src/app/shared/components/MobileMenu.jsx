"use client"

import ModalAddMovie from "@/app/dashboard/[groupName]/components/ModalAddMovie"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/drawer"
import { Listbox, ListboxItem } from "@heroui/listbox"
import { useDisclosure } from "@heroui/modal"
import { usePathname } from "next/navigation"
import { FiFilm } from "react-icons/fi"

const MobileMenu = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const pathname = usePathname()

    return (
        <>
            <button onClick={onOpen} id="menu-toggle" className="text-white md:hidden focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <Drawer isOpen={isOpen} size="xs" placement="left" onOpenChange={onOpenChange}>
                {/* terminar de fazer */}
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 text-2xl">Movye</DrawerHeader>
                            <DrawerBody>
                                <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
                                    {pathname.startsWith( "/dashboard") && (
                                        <>
                                            <ListboxItem key="addmovie" className="text-2xl" startContent={<FiFilm />}>
                                                <ModalAddMovie />
                                            </ListboxItem>
                                            <ListboxItem key="copy">Adicionar Review</ListboxItem>
                                        </>
                                    )}
                                </Listbox>
                            </DrawerBody>
                            <DrawerFooter>
                                <button color="danger" variant="light" onClick={onClose}>
                                    Close
                                </button>
                                <button color="primary" onClick={onClose}>
                                    Action
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default MobileMenu
