import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    // State to manage form inputs and errors
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    console.log("Attempting login with:", { email, password });
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission default behavior
        setError(null); // Clear previous errors
    
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Enables cookies to be sent with the request
                body: JSON.stringify({ email, password }) // Send form data
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Login successful:", data);
    
                // Redirect or set user state after successful login
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError("An unexpected error occurred. Please try again.");
        }
    };    

    // Redirect to Sign-Up page
    const handleGoSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Welcome to Memory Mosaic! Sign in to save a memory
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Update state
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update state
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Error message */}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{" "}
                    <button
                        onClick={handleGoSignUp}
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;