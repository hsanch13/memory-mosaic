from models import Board, Answer, Media
from flask import request, session, make_response
from flask_restful import Resource
from config import db
from routes.upload.uploads import Uploads
from botocore.exceptions import BotoCoreError, ClientError


class BoardResource(Resource):
    def post(self):
        try:
            # 1. Parse data from the request
            data = request.json
            print("Incoming data:", data)  # Debugging: print the payload to check structure
            
            user_id = session.get("user_id")
            if not user_id:
                print("Error: User not logged in")  # Debugging
                return make_response({"error": "User not logged in"}, 401)
            print("Session data:", session)
            print("User ID from session:", session.get("user_id"))

            # Extract board and answers data
            board_data = data.get("board")
            answers_data = data.get("answers")

            print("Board data received:", board_data)  # Debugging
            print("Answers data received:", answers_data)  # Debugging

            if not board_data or not answers_data:
                print("Error: Missing board or answers data")  # Debugging
                return make_response({"error": "Invalid request data"}, 400)

            # 2. Create the board
            print("Extracted board_type:", board_data.get("type"))  # Debugging
            print("Raw board data:", board_data)  # Debugging
            board = Board(
                user_id=user_id,
                board_type=board_data.get("type"),
                board_name=board_data.get("name")
            )
            db.session.add(board)
            db.session.commit()  # Commit to generate board_id
            print(f"Board created with ID: {board.id}")  # Debugging

            created_answers = []

            # 3. Loop through answers and create each one
            for answer_data in answers_data:
                print("Processing answer:", answer_data)  # Debugging
                # Create an answer for the board
                answer = Answer(
                    board_id=board.id,
                    question_id=answer_data.get("question_id"),
                    answer_text=answer_data.get("text"),
                )
                db.session.add(answer)
                db.session.commit()  # Commit to generate answer_id
                print(f"Answer created with ID: {answer.id}")  # Debugging

                created_answers.append(answer)

                # 4. Handle media uploads for the answer
                media_files = answer_data.get("media")  # Expecting a list of files
                if media_files:
                    for file in media_files:
                        try:
                            print("Uploading file:", file)  # Debugging: Confirm file being uploaded
                            upload_response = Uploads().post()  # Call the Uploads class
                            print("AWS Upload Response:", upload_response.json)  # Debugging response

                            if 'urls' in upload_response.json:
                                media_url = upload_response.json['urls'].pop(0)  # Get the uploaded URL
                                print("File uploaded successfully. URL:", media_url)  # Debugging

                                # Save media URL to the database
                                media = Media(
                                    answer_id=answer.id,
                                    url=media_url
                                )
                                db.session.add(media)
                            else:
                                print("Upload failed: No URLs returned.")  # Debugging
                                raise Exception("AWS upload failed")

                        except (BotoCoreError, ClientError) as e:
                            print("AWS Upload Error:", e)  # Debugging
                            raise Exception("Failed to upload media file to AWS")

            # Final commit for all media and answers
            db.session.commit()

            # 5. Success response
            print("Final board data:", board.to_dict())  # Debugging
            print("Final answers data:", [a.to_dict() for a in created_answers])  # Debugging
            print("Board and all answers successfully created!")  # Final success confirmation

            return make_response({
                "message": "Board created successfully",
                "board": board.to_dict(),  # Assuming a `to_dict` method exists
                "answers": [a.to_dict() for a in created_answers]
            }, 201)

        except Exception as e:
            db.session.rollback()
            print("Error occurred:", e)  # Debugging
            return make_response({"error": str(e)}, 400)