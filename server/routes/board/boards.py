from models import Board
from flask import request, make_response
from flask_restful import Resource
from config import db

# CRUD for Boards
class Boards(Resource):
    def get(self, id=None):
        try:
            boards = Board.query
            return make_response([board.to_dict() for board in boards], 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def post(self):
        try:
            data = request.get_json()
            new_board = Board(
                user_id=data["user_id"],
                board_type=data["board_type"],
                board_name=data.get("board_name")
            )
            db.session.add(new_board)
            db.session.commit()
            return make_response(new_board.to_dict(), 201)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
