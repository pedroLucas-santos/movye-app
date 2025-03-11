'use client'
import NavBar from '@/app/shared/NavBar'
import React, { useEffect, useState } from 'react'
import Switches from './components/Switches'
import { getUserSettings } from '@/app/lib/userApi'
import { useAuth } from '@/app/context/auth-context'
import LoadingSpinner from '../shared/LoadingSpinner'
import { CircularProgress } from '@heroui/progress'

const page = () => {
    const { user } = useAuth()
    const [settings, setSettings] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return
            const response = await getUserSettings(user.uid)
            setSettings(response)
            setLoading(false)
        }
        fetchSettings()
    }, [user?.uid])
    return (
        <>
            <NavBar />
            <div className="max-w-2xl mx-auto p-6 bg-zinc-900 text-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-4 text-white">Configurações</h1>

                <div className="mt-6 flex w-full justify-center">
                    {!loading ? <Switches settings={settings} userId={user.uid} /> : <CircularProgress size={'lg'} color={'default'} />}
                </div>
            </div>
        </>
    )
}

export default page
