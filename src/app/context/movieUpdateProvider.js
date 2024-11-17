"use client"
import React, { createContext, useContext, useState } from "react";

const MovieUpdateContext = createContext();

export const MovieUpdateProvider = ({ children }) => {
    const [updateSignal, setUpdateSignal] = useState(false);

    const triggerUpdate = () => setUpdateSignal(!updateSignal);

    return (
        <MovieUpdateContext.Provider value={{ updateSignal, triggerUpdate }}>
            {children}
        </MovieUpdateContext.Provider>
    );
};

export const useMovieUpdate = () => useContext(MovieUpdateContext);