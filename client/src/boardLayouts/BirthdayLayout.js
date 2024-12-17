import React from "react";
import "../animations/birthdayAnimations.css"; // Import Birthday animations

const BirthdayLayout = ({ questions, answers, media }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-darkGray to-birthdayAccent text-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="text-6xl font-bold text-birthdayAccent animate-bounce">
          🎉 Happy Birthday! 🎉
        </h1>
        <p className="text-gray-300 text-lg glow-effect">
          Celebrate the moments that made this year special.
        </p>
      </section>

      {/* Questions and Answers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-10">
        {questions.map((question, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-lg shadow-lg card-hover"
          >
            <h2 className="text-2xl font-semibold text-birthdayAccent mb-4">
              {question.text}
            </h2>
            <p>{answers[index]?.answer_text || "No response yet."}</p>
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

export default BirthdayLayout;
