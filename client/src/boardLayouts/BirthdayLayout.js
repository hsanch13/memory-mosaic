import React from "react";
import "../animations/birthdayAnimations.css";

const BirthdayLayout = ({ answers = [] }) => {
    const placeholders = Array.from({ length: 5 }); // Create 5 placeholders

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
            <section
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-10"
                style={{ minHeight: "300px" }}
            >
                {placeholders.map((_, index) => (
                    <div
                        key={index}
                        className="p-6 bg-gray-800 rounded-lg shadow-lg card-hover border border-green-500"
                    >
                        <h2 className="text-2xl font-semibold text-birthdayAccent mb-4">
                            Memory {index + 1}
                        </h2>
                        <p>{answers[index]?.text || "No response yet."}</p>
                        {answers[index]?.media?.length > 0 ? (
                            <img
                                src={answers[index].media[0]} // Display the first media item
                                alt={`Memory ${index + 1}`}
                                className="mt-4 rounded-lg w-full h-64 object-cover border border-red-500"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                                No image uploaded
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default BirthdayLayout;
