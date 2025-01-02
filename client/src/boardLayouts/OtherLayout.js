import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../animations/otherAnimations.css"; // Import Other animations

gsap.registerPlugin(ScrollTrigger);

const OtherLayout = ({ answers = [] }) => {
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
        <div className="min-h-screen bg-gradient-to-b from-pastelPink to-pastelYellow text-gray-900">
            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center space-y-6 text-center bg-white shadow-md border-b-4 border-pastelPurple">
                <h1 className="text-6xl font-bold text-pastelPurple drop-shadow-lg">
                    🌸 Your Memories 🌸
                </h1>
                <p className="text-lg text-gray-600 shimmer-effect">
                    A place to preserve and cherish your memories.
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
                        className="p-8 bg-white rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105 hover:shadow-xl border-2 border-pastelPurple scrapbook-card"
                    >
                        <h2 className="text-3xl font-semibold text-pastelPink mb-4">
                            Memory {index + 1}
                        </h2>
                        <p className="text-gray-700 italic">
                            {answers[index]?.text || "No response yet."}
                        </p>
                        {answers[index]?.media?.length > 0 ? (
                            <img
                                src={answers[index].media[0]} // Display the first media item
                                alt={`Memory ${index + 1}`}
                                className="mt-6 rounded-lg w-full h-64 object-cover border-4 border-pastelYellow"
                            />
                        ) : (
                            <div className="mt-6 w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 border-4 border-dashed border-pastelYellow">
                                No image uploaded
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default OtherLayout;
