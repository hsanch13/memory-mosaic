import React, { useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import BirthdayLayout from "../boardLayouts/BirthdayLayout";
import YearlyRecapLayout from "../boardLayouts/YearlyRecapLayout";
import OtherLayout from "../boardLayouts/OtherLayout";
import CelebrationLayout from "../boardLayouts/CelebrationLayout";

const BoardBuilder = () => {
  const { currentBoard } = useContext(GlobalContext);

  if (!currentBoard) {
    return (
      <div className="text-center text-red-500 text-xl font-semibold">
        Loading board...
      </div>
    );
  }

  const { board_type, questions, answers, media } = currentBoard;

  const renderLayout = () => {
    switch (board_type) {
      case "birthday":
        return (
          <BirthdayLayout
            questions={questions}
            answers={answers}
            media={media}
          />
        );
      case "yearly":
        return (
          <YearlyRecapLayout
            questions={questions}
            answers={answers}
            media={media}
          />
        );
      case "other":
        return (
          <OtherLayout
            questions={questions}
            answers={answers}
            media={media}
          />
        );
      case "celebration":
        return (
          <CelebrationLayout
            questions={questions}
            answers={answers}
            media={media}
          />
        );
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
