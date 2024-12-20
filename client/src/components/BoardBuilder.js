import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../GlobalContext";
import BirthdayLayout from "../boardLayouts/BirthdayLayout";
import YearlyRecapLayout from "../boardLayouts/YearlyRecapLayout";
import OtherLayout from "../boardLayouts/OtherLayout";
import CelebrationLayout from "../boardLayouts/CelebrationLayout";
import toast from "react-hot-toast";

const BoardBuilder = () => {
    const { currentBoard, setCurrentBoard } = useContext(GlobalContext);

    const fetchBoardData = async () => {
        try {
            const response = await fetch(`/boards/${currentBoard.id}`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentBoard(data); // Backend now includes answers with media
            } else {
                toast.error("Failed to fetch board details.");
            }
        } catch (err) {
            console.error("Error fetching board data:", err);
            toast.error("An unexpected error occurred.");
        }
    };

    useEffect(() => {
        if (currentBoard?.id) {
            fetchBoardData();
        }
    }, [currentBoard?.id]);

    if (!currentBoard) {
        return (
            <div className="text-center text-red-500 text-xl font-semibold">
                Loading board...
            </div>
        );
    }

    const { board_type, answers = [], media = [] } = currentBoard;

    const renderLayout = () => {
        switch (board_type) {
            case "birthday":
                return <BirthdayLayout answers={answers} media={media} />;
            case "yearly":
                return <YearlyRecapLayout answers={answers} media={media} />;
            case "other":
                return <OtherLayout answers={answers} media={media} />;
            case "celebration":
                return <CelebrationLayout answers={answers} media={media} />;
            default:
                return (
                    <div className="text-center text-red-500 text-xl font-semibold">
                        No layout found for this board type.
                    </div>
                );
        }
    };

    return <div className="w-full p-4">{renderLayout()}</div>;
};

export default BoardBuilder;
