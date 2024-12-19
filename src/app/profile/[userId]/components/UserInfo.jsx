import Image from "next/image"
import React from "react"

const UserInfo = ({user}) => {
    return (
        <div id="userInfo" className="flex flex-col items-center justify-center bg-black/80 p-4 rounded-xl">
            <Image
                src={`${user?.photoURL?.replace("s96-c", "s400-c")}` || null}
                alt={`${user.displayName}'s profile picture`}
                width={100}
                height={100}
                quality={100}
                className="rounded-full"
            />
            <h1 className="text-3xl font-bold mt-4">{user.displayName}</h1>
            <span className="text-gray-600 mt-2">{user.bio}</span>
            <p className="text-gray-600 mt-2">
                Criado em:{" "}
                {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                      })
                    : "No bio available"}
            </p>
        </div>
    )
}

export default UserInfo
