from models import Board, Answer, Media
from flask import request, session, make_response
from flask_restful import Resource
from config import db
from routes.upload.uploads import Uploads
import json

class BoardResource(Resource):
    def post(self):
        try:
            # 1. Parse form-data or JSON
            if request.content_type.startswith("multipart/form-data"):
                board_data = json.loads(request.form.get("board", "{}"))
                answers_data = json.loads(request.form.get("answers", "[]"))
            elif request.content_type == "application/json":
                data = request.json
                board_data = data.get("board")
                answers_data = data.get("answers")
            else:
                return make_response({"error": "Unsupported Content-Type"}, 400)

            print("Board data received:", board_data)  # Debugging
            print("Answers received:", answers_data)  # Debugging

            # 2. Ensure the user is logged in
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "User not logged in"}, 401)

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
                if media_files:
                    for file in media_files:
                        # Upload the file using the Uploads class
                        upload_response = upload_instance.post_file(file)
                        if "urls" in upload_response:
                            media_url = upload_response["urls"][0]
                            print("File uploaded to:", media_url)  # Debugging

                            # Save media URL in the Media table
                            media = Media(
                                answer_id=answer.id,
                                url=media_url
                            )
                            db.session.add(media)
                        else:
                            raise Exception("AWS upload failed")

            db.session.commit()

            # 5. Return success response
            return make_response({
                "message": "Board created successfully",
                "board": board.to_dict(),
                "answers": [a.to_dict() for a in created_answers]
            }, 201)

        except Exception as e:
            db.session.rollback()
            print("Error:", e)  # Debugging
            return make_response({"error": str(e)}, 400)
