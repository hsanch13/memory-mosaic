import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../animations/birthdayAnimations.css";

gsap.registerPlugin(ScrollTrigger);

const BirthdayLayout = ({ answers = [] }) => {
    const placeholders = Array.from({ length: 5 }); // Create 5 placeholders
    const cardsRef = useRef([]); // Ref array for all cards

    // Use effect to set up GSAP animations
    useEffect(() => {
        // GSAP animation for each card
        cardsRef.current.forEach((card, index) => {
            gsap.fromTo(
                card,
                { opacity: 0, scale: 0.8 }, // Initial state: hidden and scaled down
                {
                    opacity: 1, // Final state: fully visible
                    scale: 1, // Final state: no scaling
                    duration: 1, // Animation duration
                    ease: "power3.out", // Smooth easing
                    scrollTrigger: {
                        trigger: card, // Trigger animation on this card
                        start: "top 80%", // Start when the card enters the viewport
                        end: "top 40%", // End when it's at 40% of the viewport
                        scrub: true, // Smooth animation tied to scroll
                    },
                }
            );
        });
    }, []); // Empty dependency array to run once on mount

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
                        ref={(el) => (cardsRef.current[index] = el)} // Attach ref for animation
                        className="p-6 bg-gray-800 rounded-lg shadow-lg card-hover border border-500 photo-placeholder"
                    // Added `ref` for GSAP and `photo-placeholder` class for animation styles
                    >
                        <h2 className="text-2xl font-semibold text-birthdayAccent mb-4">
                            Memory {index + 1}
                        </h2>
                        <p>{answers[index]?.text || "No response yet."}</p>
                        {answers[index]?.media?.length > 0 ? (
                            <img
                                src={answers[index].media[0]} // Display the first media item
                                alt={`Memory ${index + 1}`}
                                className="mt-4 rounded-lg w-full h-64 object-cover border border-500"
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
