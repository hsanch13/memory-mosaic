from routes.__init__ import Resource, db, make_response, session
from models.User import User

class CurrentUser(Resource):
    def get(self):
        try:
            user_id = session.get("user_id")
            if user_id:
                user = User.query.get(user_id)
                return make_response({
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }, 200)
            return make_response({"error": "Not logged in"}, 401)
        except Exception as e:
            return make_response({"error": str(e)}, 400)