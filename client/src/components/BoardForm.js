import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function BoardForm() {
    const navigate = useNavigate();

    // Validation Schema with Yup
    const validationSchema = Yup.object().shape({
        boardType: Yup.string().required("Board type is required"),
        boardName: Yup.string()
            .min(3, "Board name must be at least 3 characters")
            .required("Board name is required"),
        answers: Yup.array()
            .of(
                Yup.object().shape({
                    text: Yup.string().required("Answer is required"),
                    file: Yup.mixed().required("Image is required"),
                })
            )
            .required(),
    });

    const initialValues = {
        boardType: "",
        boardName: "",
        answers: Array(5).fill({ text: "", file: null }), // Pre-fill 5 questions
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            // Append board data
            formData.append("board[type]", values.boardType);
            formData.append("board[name]", values.boardName);

            // Append answers and files
            values.answers.forEach((answer, index) => {
                formData.append(`answers[${index}][text]`, answer.text);
                if (answer.file) {
                    formData.append(`answers[${index}][media]`, answer.file);
                }
            });

            const response = await fetch("/boards", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                toast.success("Board created successfully!");
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to create board.");
            }
        } catch (err) {
            console.error("Error creating board:", err);
            toast.error("An unexpected error occurred.");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Toaster /> {/* Toast Notifications */}
            <h1 className="text-2xl font-bold mb-4">Create a New Board</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-6">
                        {/* Board Type */}
                        <div>
                            <label className="block font-medium text-gray-700">Board Type</label>
                            <Field
                                as="select"
                                name="boardType"
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Board Type</option>
                                <option value="birthday">Birthday</option>
                                <option value="celebration">Celebration</option>
                                <option value="yearly recap">Yearly Recap</option>
                                <option value="other">Other</option>
                            </Field>
                            <ErrorMessage
                                name="boardType"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Board Name */}
                        <div>
                            <label className="block font-medium text-gray-700">Board Name</label>
                            <Field
                                type="text"
                                name="boardName"
                                placeholder="Enter board name"
                                className="w-full p-2 border rounded"
                            />
                            <ErrorMessage
                                name="boardName"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Answers with File Upload */}
                        <FieldArray name="answers">
                            {({ push }) => (
                                <>
                                    {values.answers.map((_, index) => (
                                        <div key={index} className="border p-4 rounded space-y-2">
                                            <label className="block font-medium text-gray-700">
                                                Question {index + 1}
                                            </label>

                                            {/* Text Input */}
                                            <Field
                                                as="textarea"
                                                name={`answers[${index}].text`}
                                                placeholder={`Enter answer for Question ${index + 1}`}
                                                className="w-full p-2 border rounded"
                                            />
                                            <ErrorMessage
                                                name={`answers[${index}].text`}
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />

                                            {/* File Input */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        `answers[${index}].file`,
                                                        e.target.files[0]
                                                    )
                                                }
                                                className="w-full"
                                            />
                                            <ErrorMessage
                                                name={`answers[${index}].file`}
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </FieldArray>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Create Board
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
