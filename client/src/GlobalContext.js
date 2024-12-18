import React, { createContext, useContext, useState } from "react";

// Create Context
export const GlobalContext = createContext();

// Context Provider Component
export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Logged-in user info
    const [boardType, setBoardType] = useState(""); // Selected board type
    const [boardName, setBoardName] = useState(""); // Selected board name
    const [currentBoard, setCurrentBoard] = useState(null); // Board being edited

    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                boardType,
                setBoardType,
                boardName,
                setBoardName,
                currentBoard,
                setCurrentBoard,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook for consuming the context
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
