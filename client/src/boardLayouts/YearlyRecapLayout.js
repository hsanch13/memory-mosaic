import React from "react";
import "../animations/yearlyRecapAnimations.css"; // Import Yearly animations

const YearlyRecapLayout = ({ questions, answers, media }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yearlyGradientStart to-yearlyGradientEnd text-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4 space-y-4">
        <h1 className="text-6xl font-extrabold fade-in">Your 2024 Wrapped 📅</h1>
        <p className="text-gray-400 text-lg fade-in">
          Reflect on your best memories and achievements this year.
        </p>
      </section>

      {/* Questions and Answers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-md section-hover"
          >
            <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>
            <p>{answers[index]?.answer_text || "No response provided."}</p>
            {media[index] && (
              <img
                src={media[index].url}
                alt={`Photo ${index + 1}`}
                className="mt-4 rounded-lg w-full h-48 object-cover"
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default YearlyRecapLayout;
