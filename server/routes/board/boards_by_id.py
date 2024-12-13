from models import Board
from flask import make_response
from flask_restful import Resource, request
from config import db

class BoardsById(Resource):
    def get(self, id):
        try:
            board = Board.query.get(id)
            if not board:
                #add check to make sure it is the Current USERS board, and user must be logged in
                return make_response({"error": f"Board with id {id} not found"}, 404)
            return make_response(board.to_dict(rules=("answers", "answers.medias")), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
    def patch(self, id):
        try:
            board = Board.query.get(id)
            if not board:
            #add check to make sure it is the Current USERS board
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
