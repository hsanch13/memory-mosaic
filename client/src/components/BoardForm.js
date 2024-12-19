import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { GlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router-dom";

export default function BoardForm() {
    const { boardType, setBoardName, setCurrentBoard } = useContext(GlobalContext);
    const [questions, setQuestions] = useState([]);
    const [filePreviews, setFilePreviews] = useState({});
    const navigate = useNavigate();

    // Fetch questions dynamically based on board type
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/questions/board-type/${boardType}`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.error || "Failed to fetch questions.");
                }
            } catch (err) {
                console.error("Error fetching questions:", err);
                toast.error("An unexpected error occurred while fetching questions.");
            }
        };

        fetchQuestions();
    }, [boardType]);

    const validationSchema = Yup.object().shape({
        boardName: Yup.string()
            .min(3, "Board name must be at least 3 characters")
            .required("Board name is required"),
        answers: Yup.array().of(
            Yup.object().shape({
                text: Yup.string().required("Answer is required"),
                file: Yup.mixed().required("File is required"),
            })
        ),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append("board[type]", boardType);
            formData.append("board[name]", values.boardName);

            values.answers.forEach((answer, index) => {
                formData.append(`answers[${index}][text]`, answer.text);
                if (answer.file) {
                    formData.append(`answers[${index}][media]`, answer.file);
                }
            });

            const response = await fetch("/create-board", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Data received from backend:", data);

                // Use the backend data directly
                const boardData = {
                    board_type: boardType,
                    board_name: data.board.board_name,
                    id: data.board.id,
                    questions: data.questions || [], // Actual questions from backend
                    answers: data.answers || [],    // Actual answers from backend
                    media: data.media || [],        // Actual media from backend
                };

                console.log("Setting currentBoard in context:", boardData);
                setCurrentBoard(boardData);

                toast.success("Board created successfully!");
                navigate(`/boards/${data.board.id}`);
            } else {
                const errorData = await response.json();
                console.error("Error response from backend:", errorData);
                toast.error(errorData.error || "Failed to create board.");
            }
        } catch (err) {
            console.error("Error creating board:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6">Create a New Board</h1>
            <Formik
                initialValues={{
                    boardName: "",
                    answers: questions.map(() => ({ text: "", file: null })),
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form className="space-y-6">
                        {/* Board Name */}
                        <div>
                            <label className="block font-medium text-gray-700">Board Name</label>
                            <Field
                                type="text"
                                name="boardName"
                                placeholder="Enter board name"
                                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                            />
                            <ErrorMessage
                                name="boardName"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Answers */}
                        <FieldArray name="answers">
                            {() =>
                                questions.map((q, i) => (
                                    <div key={i} className="border p-4 rounded space-y-2">
                                        <label className="block font-medium text-gray-700">
                                            {q.text}
                                        </label>
                                        <Field
                                            as="textarea"
                                            name={`answers[${i}].text`}
                                            placeholder="Enter your answer"
                                            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                        />
                                        <ErrorMessage
                                            name={`answers[${i}].text`}
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-gray-500 border rounded cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setFieldValue(`answers[${i}].file`, file);

                                                // Generate a preview URL for the file
                                                if (file) {
                                                    const previewUrl = URL.createObjectURL(file);
                                                    setFilePreviews((prev) => ({
                                                        ...prev,
                                                        [i]: { url: previewUrl, type: file.type },
                                                    }));
                                                }
                                            }}
                                        />
                                        {filePreviews[i] && (
                                            <div className="mt-2">
                                                {filePreviews[i].type.startsWith("image/") ? (
                                                    <img
                                                        src={filePreviews[i].url}
                                                        alt={`Preview for answer ${i + 1}`}
                                                        className="w-24 h-24 object-cover border"
                                                    />
                                                ) : (
                                                    <video
                                                        src={filePreviews[i].url}
                                                        controls
                                                        className="w-24 h-24 border"
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </FieldArray>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
