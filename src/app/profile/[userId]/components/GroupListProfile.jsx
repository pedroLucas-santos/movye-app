import Image from "next/image"
import Link from "next/link"
import React from "react"

const GroupListProfile = ({groupList}) => {
    return (
        <div className="absolute top-0 left-64 flex flex-col justify-center items-center w-64 p-4 rounded-xl">
            <h2 className="text-2xl mb-2">Grupos:</h2>
            {groupList.length > 0 ? (
                <div>
                    <ul className="list-disc list-inside">
                        {groupList.slice(0, 4).map((group) => (
                            <li key={group.id} className="text-lg text-white flex justify-start items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 mb-3">
                                    <Image
                                        src={group.image ===  null ? null : group.image}
                                        alt={`${group.name}'s profile picture`}
                                        className="rounded-full"
                                        width={50}
                                        height={50}
                                        quality={100}
                                    />
                                </div>
                                <Link href={`/group/${group.id}`}>
                                    <span className="truncate">{group.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {groupList.length > 4 && <p className="text-gray-400">+{groupList.length - 4} outros grupos</p>}
                </div>
            ) : (
                <p className="mt-8 text-gray-500">Nenhum grupo.</p>
            )}
        </div>
    )
}

export default GroupListProfile