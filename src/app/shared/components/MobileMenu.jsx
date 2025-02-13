"use client"

import { useContentType } from "@/app/context/contentTypeProvider"
import ModalAddMovie from "@/app/dashboard/[groupName]/components/ModalAddMovie"
import ModalReviewMovie from "@/app/dashboard/[groupName]/components/ModalReviewMovie"
import ModalReviewShow from "@/app/dashboard/[groupName]/components/ModalReviewShow"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/drawer"
import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox"
import { useDisclosure } from "@heroui/modal"
import { usePathname } from "next/navigation"
import { FiFilm, FiStar, FiUser } from "react-icons/fi"
import SelectContentType from "./SelectContentType"
import ModalEditProfile from "@/app/profile/[userId]/components/ModalEditProfile"
import { useAuth } from "@/app/context/auth-context"

const MobileMenu = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const pathname = usePathname()
    const { contentType } = useContentType()
    const { user } = useAuth()

    return (
        <>
            <button onClick={onOpen} id="menu-toggle" className="text-white md:hidden focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <Drawer isOpen={isOpen} size="xs" placement="left" onOpenChange={onOpenChange}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 text-2xl text-white">Movye</DrawerHeader>
                            <DrawerBody>
                                <SelectContentType />
                                {pathname.startsWith("/dashboard") && (
                                    <>
                                        <div className="flex items-center justify-center gap-2 border-2 border-secondary-dark rounded-xl p-2">
                                            <FiFilm color="white"/>
                                            <ModalAddMovie />
                                        </div>
                                        <div className="flex items-center justify-center gap-2 border-2 border-secondary-dark rounded-xl p-2">
                                            <FiStar color="white"/>
                                            {contentType === "movie" ? (
                                                <ModalReviewMovie contentType={contentType} />
                                            ) : (
                                                <ModalReviewShow contentType={contentType} />
                                            )}
                                        </div>
                                    </>
                                )}

                                {pathname === `/profile/${user?.uid}` && (
                                    <>
                                        <div className="flex items-center justify-center gap-2 border-2 border-secondary-dark rounded-xl p-2">
                                            <FiUser color="white"/>
                                            <ModalEditProfile />
                                        </div>
                                    </>
                                )}

                                {/* TODO: continuar a fazer o menu mobile, abaixo fazer os botoes 'grupos' e 'amigos' no profile page */}

                                {pathname.startsWith("profile") && (
                                    <>
                                        <div className="flex items-center justify-center gap-2 border-2 border-secondary-dark rounded-xl p-2">



                                        </div>
                                    </>
                                )}
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default MobileMenu
