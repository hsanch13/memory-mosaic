import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

function SignUp() {
    const navigate = useNavigate();

    // Validation Schema with Yup
    const validationSchema = Yup.object({
        username: Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username cannot exceed 30 characters"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(10, "Password must be at least 10 characters")
            .max(20, "Password cannot exceed 20 characters"),
    });

    // Form submission handler
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch("http://localhost:5555/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Account created successfully!");
                console.log("Signup successful:", data);
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Signup failed. Please try again.");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <Toaster /> {/* Hot Toast container for notifications */}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Formik
                    initialValues={{ username: "", email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <Field
                                        type="text"
                                        name="username"
                                        id="username"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Email Address
                                </label>
                                <div className="mt-2">
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <Field
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
                                >
                                    {isSubmitting ? "Registering..." : "Register"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}

export default SignUp;