from models import Board
from flask import make_response, session, request
from flask_restful import Resource
from config import db
import ipdb

class BoardsById(Resource):
    # GET: Fetch a single board by ID, only if it belongs to the logged-in user'
    def get(self, id):
        print("getting boards by id")
        try:
            # Check if user is logged in
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "Unauthorized"}, 401)

            # Query the board and validate ownership
            board = Board.query.filter_by(id=id, user_id=user_id).first()
            if not board:
                return make_response({"error": "Board not found or access denied"}, 404)
            print(board.to_dict(rules=("answers", "answers_media"))["answers_media"])
            return make_response(board.to_dict(rules=("answers", "answers_media")), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    # PATCH: Update a board's details (only by the board owner)
    def patch(self, id):
        try:
            # Check if user is logged in
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "Unauthorized. Please log in."}, 401)

            # Check board ownership
            board = Board.query.filter_by(id=id, user_id=user_id).first()
            if not board:
                return make_response({"error": "Board not found or access denied."}, 404)

            # Update board details
            data = request.get_json()
            board.board_type = data.get("board_type", board.board_type)
            board.board_name = data.get("board_name", board.board_name)
            db.session.commit()

            return make_response(board.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    # DELETE: Delete a board (only by the board owner)
    def delete(self, id):
        try:
            # Check if user is logged in
            user_id = session.get("user_id")
            if not user_id:
                return make_response({"error": "Unauthorized. Please log in."}, 401)

            # Check board ownership
            board = Board.query.filter_by(id=id, user_id=user_id).first()
            if not board:
                return make_response({"error": "Board not found or access denied."}, 404)

            db.session.delete(board)
            db.session.commit()
            return make_response({"message": f"Board with id {id} deleted"}, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)