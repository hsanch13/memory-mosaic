import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../animations/yearlyRecapAnimations.css"; // Import Yearly animations

gsap.registerPlugin(ScrollTrigger);

const YearlyRecapLayout = ({ answers = [] }) => {
    const placeholders = Array.from({ length: 5 }); // Create 5 placeholders
    const cardsRef = useRef([]); // Ref array for cards

    // Set up GSAP animations
    useEffect(() => {
        cardsRef.current.forEach((card, index) => {
            gsap.fromTo(
                card,
                { opacity: 0, y: 50 }, // Start hidden and slightly below
                {
                    opacity: 1, // Fully visible
                    y: 0, // Slide into place
                    duration: 1.2, // Animation duration
                    ease: "power3.out", // Smooth easing
                    scrollTrigger: {
                        trigger: card, // Trigger animation on the card
                        start: "top 85%", // Start when the card enters the viewport
                        end: "top 50%", // End when halfway in view
                        scrub: true, // Smooth animation tied to scroll
                    },
                }
            );
        });
    }, []); // Empty dependency array to run once on mount

    return (
        <div className="min-h-screen bg-gradient-to-b from-yearlyGradientStart to-yearlyGradientEnd text-white">
            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4 space-y-6 bg-black/50 shadow-lg">
                <h1 className="text-6xl font-extrabold fade-in drop-shadow-lg">
                    Your 2024 Recapped 📅
                </h1>
                <p className="text-gray-400 text-lg shimmer-effect">
                    Reflect on your best memories and achievements this year.
                </p>
            </section>

            {/* Questions and Answers */}
            <section
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 py-16"
                style={{ minHeight: "300px" }}
            >
                {placeholders.map((_, index) => (
                    <div
                        key={index}
                        ref={(el) => (cardsRef.current[index] = el)} // Attach ref for animation
                        className="p-8 bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105 hover:shadow-xl border-2 border-gray-600"
                    >
                        <h2 className="text-3xl font-semibold text-yellow-400 mb-4">
                            Memory {index + 1}
                        </h2>
                        <p className="text-gray-300 italic">
                            {answers[index]?.text || "No response provided."}
                        </p>
                        {answers[index]?.media?.length > 0 ? (
                            <img
                                src={answers[index].media[0]} // Display the first media item
                                alt={`Memory ${index + 1}`}
                                className="mt-6 rounded-lg w-full h-64 object-cover border-4 border-yellow-400"
                            />
                        ) : (
                            <div className="mt-6 w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 border-4 border-dashed border-yellow-400">
                                No image uploaded
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default YearlyRecapLayout;