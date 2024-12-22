"use client"

import { createContext, useState, useContext } from "react";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [isSelectingReview, setIsSelectingReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null)

  return (
    <SelectionContext.Provider value={{ isSelectingReview, setIsSelectingReview, selectedReview, setSelectedReview }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelectionReview = () => useContext(SelectionContext);