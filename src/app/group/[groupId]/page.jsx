//TODO: fazer a pagina do grupo (imagem do grupo, usuarios, filmes assistidos, reviews, botao para convidar outros usuarios)

import { getGroupData } from "@/app/lib/groupApi"
import { fetchGroupReviews, fetchMoviesWatched } from "@/app/lib/movieApi"
import NavBar from "@/app/shared/NavBar"
import React, { Suspense } from "react"
import GroupMoviesWatched from "./components/GroupMoviesWatched"
import { GroupReviews } from "./components/GroupReviews"
import Link from "next/link"
import GroupMembers from "./components/GroupMembers"
import ModalInviteUsers from "./components/ModalInviteUsers"
import GroupActions from "./components/GroupActions"
import { fetchShowsGroupReviews, fetchShowsWatched } from "@/app/lib/showApi"

const Page = async ({ params }) => {
    const { groupId } = await params
    const group = await getGroupData(groupId)
    const watchedMovies = await fetchMoviesWatched(groupId)
    const watchedShows = await fetchShowsWatched(groupId)
    const reviews = await fetchGroupReviews(groupId)
    const showReviews = await fetchShowsGroupReviews(groupId)

    return (
        <>
            <NavBar />
            <Suspense>
                <div className="flex flex-col w-full bg-primary-dark">
                    <div className="group-page md:max-w-4xl md:mx-auto p-6 bg-primary-dark rounded-lg overflow-hidden">
                        {group ? (
                            <>
                                <header className="group-header text-center mb-8 flex flex-col justify-center items-center">
                                    <img
                                        src={group.image}
                                        alt={`Imagem do grupo ${group.name}`}
                                        className="group-image w-32 h-32 mx-auto rounded-full object-cover shadow-md"
                                    />
                                    <h1 className="text-2xl font-bold mt-4 text-gray-200">{group.name}</h1>
                                    <p className="text-gray-600 mt-2">{`Criado em: ${group.createdAt}`}</p>
                                    <ModalInviteUsers groupCreatorId={group.creatorId} groupId={groupId}/>
                                </header>
                                <GroupMembers members={group.members} groupCreatorId={group.creatorId} groupId={groupId}/>
                                <GroupMoviesWatched watchedMovies={watchedMovies} watchedShows={watchedShows} groupId={groupId} groupCreatorId={group.creatorId}/>
                                <GroupReviews reviews={reviews} showReviews={showReviews}/>
                                <div className="w-full flex items-center justify-center">
                                    <GroupActions groupCreatorId={group.creatorId} groupId={groupId} groupName={group.name} groupMembers={group.members}/>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-600">Carregando dados do grupo...</p>
                        )}
                    </div>
                </div>
            </Suspense>
        </>
    )
}

export default Page
