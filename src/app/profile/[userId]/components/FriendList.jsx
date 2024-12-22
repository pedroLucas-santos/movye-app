import Image from "next/image"
import React from "react"

const FriendList = ({friendList}) => {
    return (
        <div className="absolute top-0 right-64 flex flex-col justify-center items-center w-64 p-4 rounded-xl">
            <h2 className="text-2xl mb-2">Amigos:</h2>
            {friendList.length > 0 ? (
                <div>
                    <ul className="list-disc list-inside">
                        {friendList.slice(0, 4).map((friend) => (
                            <li key={friend.id} className="text-lg text-white flex justify-center items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 mb-3">
                                    <Image
                                        src={`${friend?.photoURL?.replace("s96-c", "s400-c")}` || null}
                                        alt={`${friend.displayName}'s profile picture`}
                                        className="rounded-full"
                                        width={50}
                                        height={50}
                                        quality={100}
                                    />
                                </div>
                                <a href={`/profile/${friend.id}`} className="hover:cursor-pointer truncate w-40">
                                    {friend.displayName}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {friendList.length > 4 && <p className="text-gray-400">+{friendList.length - 4} outros amigos</p>}
                </div>
            ) : (
                <p className="mt-8 text-gray-500">Nenhum amigo.</p>
            )}
        </div>
    )
}

export default FriendList
