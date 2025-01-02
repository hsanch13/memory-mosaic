import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../animations/celebrationAnimations.css"; // Import Celebration animations

gsap.registerPlugin(ScrollTrigger);

const CelebrationLayout = ({ answers = [] }) => {
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
        <div className="min-h-screen bg-eventAccent text-gray-900">
            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center space-y-4 text-center bg-white shadow-md">
                <h1 className="text-6xl font-bold text-eventPrimary animate-scale">
                    🎊 A Celebration to Remember 🎊
                </h1>
                <p className="text-lg text-gray-600 shimmer-effect">
                    Capture and cherish your special moments.
                </p>
            </section>

            {/* Questions and Answers */}
            <section
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-12"
                style={{ minHeight: "300px" }}
            >
                {placeholders.map((_, index) => (
                    <div
                        key={index}
                        ref={(el) => (cardsRef.current[index] = el)} // Attach ref for animation
                        className="p-6 bg-white rounded-lg shadow-lg elegant-hover border border-gray-300"
                    >
                        <h2 className="text-2xl font-semibold text-eventPrimary mb-4">
                            Memory {index + 1}
                        </h2>
                        <p className="text-gray-700">
                            {answers[index]?.text || "No response yet."}
                        </p>
                        {answers[index]?.media?.length > 0 ? (
                            <img
                                src={answers[index].media[0]} // Display the first media item
                                alt={`Memory ${index + 1}`}
                                className="mt-4 rounded-lg w-full h-48 object-cover border border-gray-300"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                No image uploaded
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default CelebrationLayout;
