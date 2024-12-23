"use client"
import React from "react"

const CreateGroupButton = () => {
    return (
        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer hover:text-gray-300 hover:border-gray-200 transition-colors">
            <button className="text-4xl">+</button>
        </div>
    )
}

export default CreateGroupButton
