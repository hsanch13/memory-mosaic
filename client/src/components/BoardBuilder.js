import React from "react";

// Import layouts
import BirthdayLayout from "../boardLayouts/BirthdayLayout";
import YearlyRecapLayout from "../boardLayouts/YearlyRecapLayout";
import OtherLayout from "../boardLayouts/OtherLayout";
import CelebrationLayout from "../boardLayouts/CelebrationLayout";

const dummyData = {
  questions: ["What is your favorite memory?", "Who was there?"],
  answers: ["A trip to the beach", "Family and friends"],
  media: ["https://via.placeholder.com/150"], // Placeholder image link
};

const BoardBuilder = ({ boardType }) => {
  // Render the appropriate layout with dummy data
  const renderLayout = () => {
    switch (boardType) {
      case "birthday":
        return <BirthdayLayout {...dummyData} />;
      case "yearly":
        return <YearlyRecapLayout {...dummyData} />;
      case "other":
        return <OtherLayout {...dummyData} />;
      case "celebration":
        return <CelebrationLayout {...dummyData} />;
      default:
        return (
          <div className="text-center text-red-500 text-xl font-semibold">
            No layout found for this board type.
          </div>
        );
    }
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Layout Preview</h1>
      {renderLayout()}
    </div>
  );
};

export default BoardBuilder;
