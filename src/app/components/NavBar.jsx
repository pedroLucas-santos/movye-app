"use client"
import React, { useState } from "react"

const NavBar = () => {
    const [isProfileDropdown, setProfileDropdown] = useState(false)

    const toggleProfileDropdown = () => {
        setProfileDropdown(!isProfileDropdown)
    }

    return (
        <nav className="flex justify-around items-center h-32 w-full border-2 border-red-700">
            <button id="menu-toggle" className="text-white md:hidden focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <div id="logo" className="border-2 border-cyan-600">
                <h1>Movye</h1>
            </div>

            <div>
                <ul className="hidden md:flex items-center justify-center">
                    <li>
                        <a href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                            Inicio
                        </a>
                    </li>
                    <li>
                        <a href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                            Explorar
                        </a>
                    </li>
                    <li>
                        <a href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                            Sugestões
                        </a>
                    </li>
                    <li>
                        <a href="" className="p-2 rounded-xl hover:bg-secondary-dark transition ease-out">
                            Estatisticas
                        </a>
                    </li>
                </ul>
            </div>

            <div className="flex justify-center items-center gap-4">
                <div>
                    <button className="bg-transparent text-white border-2 transition duration-150 hover:border-white/10 hover:bg-secondary-dark p-2 rounded-md">Adicionar Filme</button>
                </div>
                <div>
                    <img
                        id="avatar"
                        src="/docs/images/people/profile-picture-5.jpg"
                        className="border-2 border-slate-950 border-dashed rounded-full h-10 w-10 cursor-pointer"
                        onClick={toggleProfileDropdown}
                    />
                    {isProfileDropdown && (
                        <div
                            id="userDropdown"
                            className="absolute top-24 right-auto z-10 divide-y divide-gray-100  w-48 bg-secondary-dark rounded-md shadow-md py-2 text-left"
                            data-dropdown-target="userDropdown"
                        >
                            <div className="px-4 py-3 text-sm text-white flex flex-col">
                                <span>pedro</span>
                                <span>pedro</span>
                                <span>pedro</span>
                                <span>pedro</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar
