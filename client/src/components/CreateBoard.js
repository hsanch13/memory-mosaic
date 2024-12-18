import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateBoard() {
    const [selectedType, setSelectedType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedType) return;

        // Navigate to the form for the selected board type
        navigate(`/create-board/${selectedType}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-6">Create a New Board</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="boardType" className="block">
                    Which board do you want to create?
                </label>
                <select
                    id="boardType"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Select a board type</option>
                    <option value="birthday">Birthday</option>
                    <option value="celebration">Celebration</option>
                    <option value="yearly_recap">Yearly Recap</option>
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