"use client"

import { createContext, useState, useContext } from "react";

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [isSelectingReview, setIsSelectingReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null)

  console.log("Context State:", { isSelectingReview });
  console.log("Selected Review State:", { selectedReview });

  return (
    <SelectionContext.Provider value={{ isSelectingReview, setIsSelectingReview, selectedReview, setSelectedReview }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelectionReview = () => useContext(SelectionContext);