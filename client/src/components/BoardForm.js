import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { GlobalContext } from "../GlobalContext";

export default function BoardForm() {
    const { boardType, setBoardName } = useContext(GlobalContext);
    const [questions, setQuestions] = useState([]);

    // Fetch questions dynamically based on board type
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/questions/board-type/${boardType}`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data); // Store fetched questions
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
                file: Yup.mixed().required("Image is required"),
            })
        ),
    });

    const handleSubmit = async (values) => {
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
                const { board } = await response.json();
                toast.success("Board created successfully!");
                navigate(`/boards/${board.id}`);
            } else {
                toast.error("Failed to create board.");
            }
        } catch (err) {
            console.error("Error creating board:", err);
            toast.error("An unexpected error occurred.");
        }
    };

    return (
        <div>
            <Toaster />
            <Formik
                initialValues={{
                    boardName: "",
                    answers: questions.map(() => ({ text: "", file: null })),
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <Field
                            type="text"
                            name="boardName"
                            placeholder="Enter board name"
                            className="input-field"
                        />
                        <FieldArray name="answers">
                            {() =>
                                questions.map((q, i) => (
                                    <div key={i}>
                                        <label>{q.text}</label>
                                        <Field
                                            as="textarea"
                                            name={`answers[${i}].text`}
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    `answers[${i}].file`,
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </div>
                                ))
                            }
                        </FieldArray>
                        <button type="submit">Create</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}