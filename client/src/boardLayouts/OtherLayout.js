import React from "react";
import "../animations/otherAnimations.css"; // Import Other animations

const OtherLayout = ({ questions, answers, media }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-travelAccent text-white">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-gray-800">
        <h1 className="text-6xl font-bold text-center slide-up">
          🗂️ Create Your Unique Board 🗂️
        </h1>
      </section>

      {/* Questions and Answers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-12">
        {questions.map((question, index) => (
          <div
            key={index}
            className="p-6 bg-gray-700 rounded-lg shadow-lg photo-hover"
          >
            <h2 className="text-2xl font-semibold mb-4">{question.text}</h2>
            <p>{answers[index]?.answer_text || "No response yet."}</p>
            {media[index] && (
              <img
                src={media[index].url}
                alt={`Media ${index + 1}`}
                className="mt-4 w-full h-48 rounded-lg object-cover"
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default OtherLayout;
