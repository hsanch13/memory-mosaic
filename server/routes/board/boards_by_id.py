from models import Board
from flask import make_response
from flask_restful import Resource

class BoardsById(Resource):
    def get(self, id):
        try:
            board = Board.query.get(id)
            if not board:
                return make_response({"error": f"Board with id {id} not found"}, 404)
            return make_response(board.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)