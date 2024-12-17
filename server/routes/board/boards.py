from models import Board
from flask import request, make_response, session
from flask_restful import Resource
from config import db

class Boards(Resource):
    # GET: Fetch all boards belonging to the logged-in user
    def get(self):
        try:
            # Check if user is logged in
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "Unauthorized. Please log in."}, 401)

            # Fetch all boards for the logged-in user
            user_boards = Board.query.filter_by(user_id=user_id).all()
            return make_response(
                [board.to_dict() for board in user_boards],
                200
            )
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    # POST: Create a new board for the logged-in user
    def post(self):
        try:
            # Check if user is logged in
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "Unauthorized. Please log in."}, 401)

            # Create a new board
            data = request.get_json()
            new_board = Board(
                user_id=user_id,
                board_type=data.get("board_type"),
                board_name=data.get("board_name")
            )
            db.session.add(new_board)
            db.session.commit()

            return make_response(new_board.to_dict(), 201)
        except Exception as e:
            return make_response({"error": str(e)}, 500)