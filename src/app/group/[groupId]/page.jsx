//TODO: fazer a pagina do grupo (imagem do grupo, usuarios, filmes assistidos, reviews, botao para convidar outros usuarios)

import { getGroupData } from "@/app/lib/groupApi"
import { fetchGroupReviews, fetchMoviesWatched } from "@/app/lib/movieApi"
import NavBar from "@/app/shared/NavBar"
import React, { Suspense } from "react"
import GroupMoviesWatched from "./components/GroupMoviesWatched"
import { GroupReviews } from "./components/GroupReviews"
import Link from "next/link"
import InviteUsers from "./components/InviteUsers"
import GroupMembers from "./components/GroupMembers"

const page = async ({ params }) => {
    const { groupId } = await params
    const group = await getGroupData(groupId)
    const watchedMovies = await fetchMoviesWatched(groupId)
    const reviews = await fetchGroupReviews(groupId)

    return (
        <>
            <NavBar />
            <Suspense>
                <div className="group-page max-w-4xl mx-auto p-6 bg-primary-dark rounded-lg shadow-md overflow-hidden">
                    {group ? (
                        <>
                            <header className="group-header text-center mb-8">
                                <img
                                    src={group.image}
                                    alt={`Imagem do grupo ${group.name}`}
                                    className="group-image w-32 h-32 mx-auto rounded-full object-cover shadow-md"
                                />
                                <h1 className="text-2xl font-bold mt-4 text-gray-200">{group.name}</h1>
                                <p className="text-gray-600 mt-2">{"Descrição do grupo aqui"}</p>
                                <p className="text-gray-600 mt-2">{`Criado em: ${group.createdAt}`}</p>
                                <InviteUsers groupCreatorId={group.creatorId} />
                            </header>

                            <GroupMembers members={group.members} />

                            <GroupMoviesWatched watchedMovies={watchedMovies} />

                            <GroupReviews reviews={reviews} />
                        </>
                    ) : (
                        <p className="text-center text-gray-600">Carregando dados do grupo...</p>
                    )}
                </div>
            </Suspense>
        </>
    )
}

export default page
