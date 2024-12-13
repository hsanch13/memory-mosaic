from models import BoardMedia
from flask import make_response
from flask_restful import Resource, request
from config import db

# CRUD for BoardMedia
class BoardMedia(Resource):
    def get(self, id=None):
        try:
            if id:
                board_media = BoardMedia.query.get(id)
                if not board_media:
                    return make_response({"error": f"BoardMedia with id {id} not found"}, 404)
                return make_response(board_media.to_dict(), 200)
            board_media_items = BoardMedia.query
            return make_response([item.to_dict() for item in board_media_items], 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def post(self):
        try:
            data = request.get_json()
            new_board_media = BoardMedia(
                board_id=data["board_id"],
                media_id=data["media_id"]
            )
            db.session.add(new_board_media)
            db.session.commit()
            return make_response(new_board_media.to_dict(), 201)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def delete(self, id):
        try:
            board_media = BoardMedia.query.get(id)
            if not board_media:
                return make_response({"error": f"BoardMedia with id {id} not found"}, 404)
            db.session.delete(board_media)
            db.session.commit()
            return make_response({"message": f"BoardMedia with id {id} deleted"}, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
