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

    def patch(self, id):
        try:
            board = Board.query.get(id)
            if not board:
                return make_response({"error": f"Board with id {id} not found"}, 404)
            data = request.get_json()
            board.board_type = data.get("board_type", board.board_type)
            board.board_name = data.get("board_name", board.board_name)
            db.session.commit()
            return make_response(board.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def delete(self, id):
        try:
            board = Board.query.get(id)
            if not board:
                return make_response({"error": f"Board with id {id} not found"}, 404)
            db.session.delete(board)
            db.session.commit()
            return make_response({"message": f"Board with id {id} deleted"}, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
