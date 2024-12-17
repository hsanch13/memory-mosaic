import React from "react";
import "../animations/celebrationAnimations.css"; // Import Celebration animations

const CelebrationLayout = ({ questions, answers, media }) => {
  return (
    <div className="min-h-screen bg-eventAccent text-gray-900">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center space-y-4 text-center bg-white shadow-md">
        <h1 className="text-6xl font-bold scale-in">🎊 A Celebration to Remember 🎊</h1>
        <p className="text-lg text-gray-600 shimmer-effect">
          Capture and cherish your special moments.
        </p>
      </section>

      {/* Questions and Answers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-12">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg elegant-hover"
          >
            <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>
            <p className="text-gray-700">{answers[index]?.answer_text || "No response yet."}</p>
            {media[index] && (
              <img
                src={media[index].url}
                alt={`Media ${index + 1}`}
                className="mt-4 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default CelebrationLayout;
