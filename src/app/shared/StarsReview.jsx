import { useState } from "react";

//terminar de fazer
const StarsReview = ({ index, rating, hoveredRating, handleRating, handleMouseEnter, handleMouseLeave }) => {
    const isFilled = index <= (hoveredRating || rating);

    return (
        <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill={isFilled ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`w-5 h-5 cursor-pointer transition-colors ${isFilled ? "text-white" : "text-white/20"}`}
            onClick={() => handleRating(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 17.75l-5.8 3.04 1.1-6.44-4.7-4.58 6.5-.58L12 2l2.9 6.28 6.5.58-4.7 4.58 1.1 6.44L12 17.75z"
            />
        </svg>
    );
};

export default StarsReview;
