from models import Board, Answer, Media
from flask import request, session, make_response
from flask_restful import Resource
from config import db
from routes.upload.uploads import Uploads
import json

class BoardResource(Resource):
    def post(self):
        try:
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "User not logged in"}, 401)
            # Debugging: Log the incoming request data
            print("Request Content-Type:", request.content_type)
            print("Request Form:", request.form)
            print("Request Files:", request.files)

            # 1. Parse form-data or JSON
            if request.content_type.startswith("multipart/form-data"):
                # Parse board data
                board_data = {
                    "type": request.form.get("board[type]"),
                    "name": request.form.get("board[name]")
                }
                print("Parsed Board Data:", board_data)  # Debugging

                # Parse answers data
                answers_data = []
                for i in range(5):  # Approximate count of answers
                    answer_text = request.form.get(f"answers[{i}][text]")
                    if answer_text:
                        answers_data.append({
                            "text": answer_text,
                            "question_id": i + 1  # Assuming questions are sequentially numbered
                        })
                print("Parsed Answers Data:", answers_data)  # Debugging
            
            ### Could get rid of elif later 
            elif request.content_type == "application/json":
                data = request.json
                board_data = data.get("board")
                answers_data = data.get("answers")
                print("Parsed Board Data:", board_data)  # Debugging
                print("Parsed Answers Data:", answers_data)  # Debugging

            else:
                return make_response({"error": "Unsupported Content-Type"}, 400)

            # 2. Ensure the user is logged in

            if not board_data or not answers_data:
                return make_response({"error": "Invalid request data"}, 400)

            # 3. Create the board
            board = Board(
                user_id=user_id,
                board_type=board_data.get("type"),
                board_name=board_data.get("name")
            )
            db.session.add(board)
            db.session.commit()
            print(f"Board created with ID: {board.id}")  # Debugging

            created_answers = []

            # 4. Loop through answers and process them
            upload_instance = Uploads()

            for idx, answer_data in enumerate(answers_data):
                # Debugging: Log each answer being processed
                print(f"Processing Answer {idx}:", answer_data)

                # Create the answer
                answer = Answer(
                    board_id=board.id,
                    question_id=answer_data.get("question_id"),
                    answer_text=answer_data.get("text"),
                )
                db.session.add(answer)
                db.session.commit()
                print(f"Answer created with ID: {answer.id}")  # Debugging
                created_answers.append(answer)

                # Handle media uploads for the answer
                media_files = request.files.getlist(f"answers[{idx}][media]")
                print(f"Media files for Answer {idx}:", media_files)  # Debugging

                if media_files:
                    for file in media_files:
                        try:
                            # Upload the file using the Uploads class
                            upload_response = upload_instance.post_file(file)
                            print(f"Upload response for file {file.filename}:", upload_response)  # Debugging

                            if "urls" in upload_response:
                                media_url = upload_response["urls"][0]
                                print("File uploaded to:", media_url)  # Debugging

                                # Save media URL in the Media table
                                media = Media(
                                    answer_id=answer.id,
                                    url=media_url
                                )
                                db.session.add(media)
                                #Could probably move final 113 commit to here 
                            else:
                                raise Exception("AWS upload failed")

                        except Exception as e:
                            print(f"Error uploading file {file.filename}:", str(e))  # Debugging
                            raise e

            db.session.commit()

            # 5. Return success response
            return make_response({
                "message": "Board created successfully",
                "board": board.to_dict(),
            }, 201)

        except Exception as e:
            db.session.rollback()
            print("Error:", str(e))  # Debugging
            return make_response({"error": str(e)}, 400)

###### PATCH ########
class BoardResource(Resource):
    def patch(self, board_id):
        try:
            # Debugging: Log the incoming request data
            print("Request Content-Type:", request.content_type)
            print("Request Form:", request.form)
            print("Request Files:", request.files)

            # Retrieve the board to update
            board = Board.query.get(board_id)
            if not board:
                return make_response({"error": f"Board with id {board_id} not found"}, 404)

            # Parse board data
            if request.content_type.startswith("multipart/form-data"):
                # Parse form-data
                board_data = {
                    "type": request.form.get("board[type]", board.board_type),
                    "name": request.form.get("board[name]", board.board_name),
                }
                answers_data = []
                for i in range(5):  # Assume a maximum of 5 answers
                    answer_text = request.form.get(f"answers[{i}][text]")
                    if answer_text:
                        answers_data.append({
                            "text": answer_text,
                            "question_id": i + 1,  # Assuming questions are sequentially numbered
                            "media": request.files.getlist(f"answers[{i}][media]"),
                        })
            elif request.content_type == "application/json":
                # Parse JSON
                data = request.json
                board_data = data.get("board", {})
                answers_data = data.get("answers", [])
            else:
                return make_response({"error": "Unsupported Content-Type"}, 400)

            print("Parsed Board Data:", board_data)  # Debugging
            print("Parsed Answers Data:", answers_data)  # Debugging

            # Update board attributes
            board.board_type = board_data.get("type", board.board_type)
            board.board_name = board_data.get("name", board.board_name)
            db.session.commit()
            print(f"Board updated with ID: {board.id}")  # Debugging

            # Update answers and handle media
            upload_instance = Uploads()
            for idx, answer_data in enumerate(answers_data):
                # Fetch or create the answer
                answer = Answer.query.filter_by(board_id=board.id, question_id=answer_data["question_id"]).first()
                if not answer:
                    answer = Answer(board_id=board.id, question_id=answer_data["question_id"])
                    db.session.add(answer)

                # Update the answer text
                answer.answer_text = answer_data["text"]
                db.session.commit()

                # Handle media uploads
                if "media" in answer_data:
                    media_files = answer_data["media"]
                    for file in media_files:
                        try:
                            # Upload the file using the Uploads class
                            upload_response = upload_instance.post_file(file)
                            print(f"Upload response for file {file.filename}:", upload_response)  # Debugging

                            if "urls" in upload_response:
                                media_url = upload_response["urls"][0]
                                print("File uploaded to:", media_url)  # Debugging

                                # Save media URL in the Media table
                                media = Media(answer_id=answer.id, url=media_url)
                                db.session.add(media)
                            else:
                                raise Exception("AWS upload failed")
                        except Exception as e:
                            print(f"Error uploading file {file.filename}:", str(e))  # Debugging
                            raise e

            db.session.commit()

            return make_response({"message": "Board updated successfully", "board": board.to_dict()}, 200)
        except Exception as e:
            db.session.rollback()
            print("Error:", str(e))  # Debugging
            return make_response({"error": str(e)}, 400)

########DELETE########

