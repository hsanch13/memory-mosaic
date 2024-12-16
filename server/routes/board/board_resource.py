from models import Board, Answer, Media
from flask import request, session, make_response
from flask_restful import Resource
from config import db
import boto3  # AWS SDK for Python
from botocore.exceptions import BotoCoreError, ClientError
from routes.upload.uploads import Uploads

class BoardResource(Resource):
    def post(self):
        try:
            # Parse data from the request
            data = request.json
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "User not logged in"}, 401)
            
            board_data = data.get("board")
            answers_data = data.get("answers")
            if not board_data or not answers_data:
                return make_response({"error": "Invalid request data"}, 400)
            
            # Create the board
            board = Board(
                user_id=user_id,
                board_type=board_data.get("type"),
                board_name=board_data.get("name")
            )
            db.session.add(board)
            db.session.commit()  # Commit to generate board_id
            
            created_answers = []

            # Loop through answers and create them
            for answer_data in answers_data:
                answer = Answer(
                    board_id=board.id,
                    question_id=answer_data.get("question_id"),
                    answer_text=answer_data.get("text"),
                )
                db.session.add(answer)
                db.session.commit()  # Commit to generate answer_id
                created_answers.append(answer)

                # Handle media uploads for the answer
                media_files = answer_data.get("media")
                if media_files:
                    for media_file in media_files:
                        media_url = Uploads.post(request)
                        if not media_url:
                            raise Exception("AWS upload failed")
                        
                        media = Media(
                            answer_id=answer.id,
                            url=media_url
                        )
                        db.session.add(media)

            # Final commit for media
            db.session.commit()

            # Success response
            return make_response(
                make_response({
                    "message": "Board created successfully",
                    "board": board.to_dict(),  # Assuming a `to_dict` method exists
                    "answers": [a.to_dict() for a in created_answers]
                }),
                201
            )

        except Exception as e:
            db.session.rollback()
            return make_response({"error": str(e)}, 400)


# def upload_to_aws(file):
#     """
#     Uploads a file to AWS S3 and returns the URL.
#     """
#     s3 = boto3.client('s3', aws_access_key_id="YOUR_ACCESS_KEY", aws_secret_access_key="YOUR_SECRET_KEY")
#     bucket_name = "your-bucket-name"
    
#     try:
#         file_name = file.filename  # Ensure file object has a filename attribute
#         s3.upload_fileobj(file, bucket_name, file_name)
#         return f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
#     except (BotoCoreError, ClientError) as e:
#         print(f"Error uploading to AWS: {e}")
#         return None
