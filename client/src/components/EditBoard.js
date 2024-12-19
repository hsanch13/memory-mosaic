import React, { useEffect, useState, useContext } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GlobalContext } from "../GlobalContext";

export default function EditBoard() {
  const { currentBoard } = useContext(GlobalContext);
  const [boardData, setBoardData] = useState(null); // State for board data
  const { id } = useParams(); // Get the board ID from the URL
  const [filePreviews, setFilePreviews] = useState({}); // State for previewing files
  const navigate = useNavigate();

    // Fetch board data on mount
    // this useEffect will be used again in ViewData.js to see the final board creation -- make sure to serialize answers and media inside the board in the GET and PATCH for one board resource 
    useEffect(() => {
      const fetchBoardData = async () => {
          try {
              const response = await fetch(`/boards/${id}`, {
                  credentials: "include",
              });
              if (response.ok) {
                  const data = await response.json();
                  setBoardData(data); // Populate board data

                  // Prepopulate thumbnails for existing media
                  const initialPreviews = {};
                  data.answers.forEach((answer, index) => {
                      if (answer.media && answer.media.length > 0) {
                          // Assume the first media file as the primary file for display
                          initialPreviews[index] = { 
                              url: answer.media[0].url, 
                              type: answer.media[0].type 
                          };
                      }
                  });
                  setFilePreviews(initialPreviews);
              } else {
                  const errorData = await response.json();
                  toast.error(errorData.error || "Failed to fetch board data.");
              }
          } catch (err) {
              console.error("Error fetching board data:", err);
              toast.error("An unexpected error occurred while fetching board data.");
          }
      };

      fetchBoardData();
  }, [id]);

  // Validation schema
  const validationSchema = Yup.object().shape({
      boardName: Yup.string()
          .min(3, "Board name must be at least 3 characters")
          .required("Board name is required"),
      answers: Yup.array().of(
          Yup.object().shape({
              text: Yup.string().required("Answer is required"),
              file: Yup.mixed(),
          })
      ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
      try {
          const formData = new FormData();
          formData.append("board[type]", boardData.board_type);
          formData.append("board[name]", values.boardName);

          values.answers.forEach((answer, index) => {
              formData.append(`answers[${index}][text]`, answer.text);
              if (answer.file) {
                  formData.append(`answers[${index}][media]`, answer.file);
              }
          });

          const response = await fetch(`/boards/${id}`, {
              method: "PATCH",
              credentials: "include",
              body: formData,
          });

          if (response.ok) {
              toast.success("Board updated successfully!");
              navigate(`/boards/${id}`);
          } else {
              const errorData = await response.json();
              toast.error(errorData.error || "Failed to update board.");
          }
      } catch (err) {
          console.error("Error updating board:", err);
          toast.error("An unexpected error occurred.");
      } finally {
          setSubmitting(false);
      }
  };

  // Wait for board data to load
  if (!boardData) {
      return <div>Loading board data...</div>;
  }

  return (
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
          <Toaster />
          <h1 className="text-2xl font-bold mb-6">Edit Board: {boardData.board_name}</h1>
          <Formik
              initialValues={{
                  boardName: boardData.board_name,
                  answers: boardData.answers.map((a) => ({
                      text: a.answer_text,
                      file: null, // Leave this empty, as we cannot pre-fill file inputs
                  })),
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
          >
              {({ setFieldValue }) => (
                  <Form className="space-y-6">
                      {/* Board Name */}
                      <div>
                          <label className="block text-gray-700 font-medium mb-2">Board Name</label>
                          <Field
                              type="text"
                              name="boardName"
                              placeholder="Enter board name"
                              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
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
                              boardData.answers.map((q, i) => (
                                  <div key={i} className="border p-4 rounded mb-4">
                                      <label className="block font-medium mb-2">
                                          Answer {i + 1}
                                      </label>
                                      <Field
                                          as="textarea"
                                          name={`answers[${i}].text`}
                                          placeholder="Enter your answer"
                                          className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                                      />
                                      <ErrorMessage
                                          name={`answers[${i}].text`}
                                          component="div"
                                          className="text-red-500 text-sm mb-2"
                                      />
                                      <input
                                          type="file"
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
                                          className="w-full text-sm text-gray-500 border rounded cursor-pointer"
                                      />
                                      {/* Display the thumbnail */}
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
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                      >
                          Update
                      </button>
                  </Form>
              )}
          </Formik>
      </div>
  );
}