'use client'
import { useState } from "react"
import Link from "next/link"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export default function GroupMembers({ members }) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Lógica para determinar os membros a serem exibidos
    const toggleExpand = () => setIsExpanded(!isExpanded)

    const membersToShow = isExpanded ? members.length : 3

    return (
        <section className="group-members mb-8">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Membros</h2>

            <ul className="space-y-2">
                {members.slice(0, membersToShow).map((member) => (
                    <li key={member.id} className="bg-secondary-dark shadow-sm p-4 flex items-center gap-2">
                        <Link href={`/profile/${member.id}`} className="flex justify-center items-center gap-2">
                            <img src={member.photoURL} alt="" className="rounded-full w-12 h-12" />
                            <span className="text-gray-200">{member.displayName}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center mt-4">
                {members.length > 3 && (
                    <button onClick={toggleExpand} className="text-gray-200 hover:text-gray-400 transition-colors">
                        {isExpanded ? (
                            <FaChevronUp className="text-2xl" /> // Ícone de seta para cima
                        ) : (
                            <FaChevronDown className="text-2xl" /> // Ícone de seta para baixo
                        )}
                    </button>
                )}
            </div>
        </section>
    )
}
