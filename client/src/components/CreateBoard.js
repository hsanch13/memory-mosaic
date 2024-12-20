import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";

export default function CreateBoard() {
    const { setBoardType } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedType = e.target.boardType.value; // Get selected value
        if (!selectedType) return;

        setBoardType(selectedType); // Save in context
        navigate(`/create-board/${selectedType}`); // Navigate to the form
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-6">Create a New Board</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="boardType" className="block">
                    Which board do you want to create?
                </label>
                <select id="boardType" name="boardType" className="border p-2 rounded">
                    <option value="">Select a board type</option>
                    <option value="birthday">Birthday</option>
                    <option value="celebration">Celebration</option>
                    <option value="yearly recap">Yearly Recap</option>
                    <option value="other">Other</option>
                </select>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Next
                </button>
            </form>
        </div>
    );
}