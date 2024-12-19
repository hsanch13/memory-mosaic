import React, { createContext, useContext, useState } from "react";

// Create Context
export const GlobalContext = createContext();

// Context Provider Component
export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Logged-in user info
    const [boardType, setBoardType] = useState(""); // Selected board type
    const [boardName, setBoardName] = useState(""); // Selected board name
    const [currentBoard, setCurrentBoard] = useState(null); // Board being edited or created

    // Helper Functions
    const clearCurrentBoard = () => setCurrentBoard(null); // Clear the board data

    const updateCurrentBoard = (updates) => {
        // Update parts of the currentBoard
        setCurrentBoard((prevBoard) => ({ ...prevBoard, ...updates }));
    };

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
                clearCurrentBoard, // helper function
                updateCurrentBoard, // helper function
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
