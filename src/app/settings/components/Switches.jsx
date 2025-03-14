'use client'
import { saveUserSettings } from '@/app/lib/userApi'
import { Switch } from '@heroui/switch'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Switches = ({ settings, userId }) => {
    const [newReviewsSelection, setNewReviewsSelection] = useState(settings.notificationsReviews)
    const [moviesUpdateSelection, setMoviesUpdateSelection] = useState(settings.notificationsMovies)
    const [showsUpdateSelection, setShowsUpdateSelection] = useState(settings.notificationsShows)
    const [publicReviews, setPublicReviews] = useState(settings.publicReviews)

    const saveSettings = async () => {
        try {
            await saveUserSettings(userId, {
                notificationsReviews: newReviewsSelection,
                notificationsMovies: moviesUpdateSelection,
                notificationsShows: showsUpdateSelection,
                publicReviews: publicReviews
            })
            toast.success('Configurações salvas com sucesso!')
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="flex flex-col flex-grow">
            <h2 className="text-lg font-semibold mb-2 text-white">Notificações</h2>

            <div className="pl-6 flex justify-between items-center py-3">
                <span className="text-white">Novas Reviews</span>
                <Switch color="success" isSelected={newReviewsSelection} onValueChange={setNewReviewsSelection}></Switch>
            </div>

            {/* Notificações de Atualizações de Filmes */}
            <div className="pl-6 flex justify-between items-center py-3">
                <span className="text-white">Filmes adicionados no grupo</span>
                <Switch color="success" isSelected={moviesUpdateSelection} onValueChange={setMoviesUpdateSelection}></Switch>
            </div>

            <div className="pl-6 flex justify-between items-center py-3">
                <span className="text-white">Séries adicionadas no grupo</span>
                <Switch color="success" isSelected={showsUpdateSelection} onValueChange={setShowsUpdateSelection}></Switch>
            </div>

            <h2 className="text-lg font-semibold mb-2 text-white">Reviews</h2>

            <div className="pl-6 flex justify-between items-center py-3">
                <span className="text-white">Reviews públicas (Explorar)</span>
                <Switch color="success" isSelected={publicReviews} onValueChange={setPublicReviews}></Switch>
            </div>

            <button
                onClick={saveSettings}
                className="self-end px-4 py-2 mt-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            >
                Salvar
            </button>
        </div>
    )
}

export default Switches
