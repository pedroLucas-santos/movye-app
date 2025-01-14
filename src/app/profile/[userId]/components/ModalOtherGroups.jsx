//TODO: fazer o modal fechar
import Image from "next/image"
import Link from "next/link"
import React from "react"

const ModalOtherGroups = async ({ groupList }) => {
    return (
        <div className={`fixed flex justify-center p-12 z-10 w-dvw h-dvh bg-black/40 transition duration-300`}>
            <div className="w-[400px] h-[650px] bg-primary-dark pt-10 pb-10 pl-12 pr-12 overflow-y-auto rounded-md">
                <div className="grid grid-cols-3 items-center justify-items-center">
                    <div></div>
                    <span className="text-2xl">Grupos</span>
                    <button className="cursor-pointer justify-self-end">X</button>
                </div>
                <div className="flex justify-center items-center mt-2">
                    <ul className="pl-4 mt-4">
                        {groupList.map((group) => (
                            <li key={group.id} className="text-sm  flex items-center gap-4">
                                <div className="flex-shrink-0 w-16 h-16 mb-3">
                                    <Link href={`/group/${group.id}`}>
                                        <Image
                                            src={group.image === null ? null : group.image}
                                            alt={`${group.name}'s profile picture`}
                                            className="rounded-full w-full h-full"
                                            width={500}
                                            height={500}
                                            quality={100}
                                        />
                                    </Link>
                                </div>
                                <div>
                                    <Link href={`/group/${group.id}`}>
                                        <span className="truncate">{group.name}</span>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ModalOtherGroups
