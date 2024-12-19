import Image from "next/image"
import React from "react"

const FriendList = ({ friendList }) => {
    return (
        <div className="absolute top-24 right-64 flex flex-col justify-center items-center w-64 bg-black/80 p-4 rounded-xl">
            <h2 className="text-2xl mb-2">Amigos:</h2>
            {friendList.length > 0 ? (
                <div>
                    <ul className="list-disc list-inside">
                        {friendList.slice(0, 6).map((friend) => (
                            <li key={friend.id} className="text-lg text-white flex justify-center items-center gap-4">
                                <Image
                                    src={`${friend?.photoURL?.replace("s96-c", "s400-c")}` || null}
                                    alt={`${friend.displayName}'s profile picture`}
                                    className="rounded-full"
                                    width={50}
                                    height={50}
                                    quality={100}
                                />
                                <a href={`/profile/${friend.id}`} className="hover:cursor-pointer truncate">{friend.displayName}</a>
                            </li>
                        ))}
                    </ul>
                    {friendList.length > 6 && <p className="mt-4 text-gray-400">+{friendList.length - 6} outros amigos</p>}
                </div>
            ) : (
                <p className="mt-8 text-gray-500">No friends to show.</p>
            )}
        </div>
    )
}

export default FriendList
