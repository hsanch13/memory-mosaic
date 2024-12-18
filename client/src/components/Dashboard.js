import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useGlobalContext } from "../GlobalContext";

export default function Dashboard() {
    const [boards, setBoards] = useState([]); // State to hold the user's boards
    const [error, setError] = useState(null); // State for critical errors
    const { setCurrentBoard } = useGlobalContext(); // Access the global context
    const navigate = useNavigate();

    // Fetch boards from the backend
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch("/boards", {
                    method: "GET",
                    credentials: "include", // Include session cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setBoards(data);
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.error || "Failed to load boards.");
                }
            } catch (err) {
                console.error("Error fetching boards:", err);
                toast.error("An unexpected error occurred while fetching boards.");
                setError("An unexpected error occurred. Please try again.");
            }
        };

        fetchBoards();
    }, []);

    // Handle Delete Board
    const handleDelete = async (boardId) => {
        try {
            const response = await fetch(`/boards/${boardId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setBoards(boards.filter((board) => board.id !== boardId));
                toast.success("Board deleted successfully!");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to delete the board.");
            }
        } catch (err) {
            console.error("Error deleting board:", err);
            toast.error("An unexpected error occurred while deleting the board.");
        }
    };

    // Handle Edit Board
    const handleEdit = (board) => {
        setCurrentBoard(board); // Store the board data in context
        navigate(`/edit-board/${board.id}`); // Navigate to edit page
    };

    return (
        <div className="flex">
            <Toaster /> {/* React Hot Toast Container */}

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 bg-gray-100">
                <header className="bg-white shadow">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-bold">My Boards</h1>
                    </div>
                </header>

                <main className="p-6">
                    {/* Add Board Button */}
                    <div className="mb-4 flex justify-between items-center">
                        <button
                            className="bg-black text-white px-4 py-2 rounded"
                            onClick={() => navigate("/create-board")}
                        >
                            + Create Board
                        </button>
                    </div>

                    {/* Critical Error Message */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Table */}
                    <table className="w-full bg-white border rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Created On</th>
                                <th className="p-3 text-left">Last Edited</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boards.length > 0 ? (
                                boards.map((board) => (
                                    <tr key={board.id} className="border-t">
                                        <td className="p-3">{board.board_name}</td>
                                        <td className="p-3">{board.board_type}</td>
                                        <td className="p-3">{board.created_at}</td>
                                        <td className="p-3">{board.updated_at}</td>
                                        <td className="p-3 space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleEdit(board)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleDelete(board.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-3 text-center" colSpan="5">
                                        No boards available. Create your first board!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
}
