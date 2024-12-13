from routes.__init__ import Resource, request, db, make_response, session
from models.User import User

class Login(Resource):
    def post(self):
        try:
            data = request.json
            user = User.query.filter_by(email=data.get("email", "")).first()
            if user and user.authenticate(data.get("password", "")):
                session["user_id"] = user.id
                return make_response(user.to_dict(), 200)
            else:
                return make_response("Invalid Credentials", 401)
        except Exception as e:
            return {"error": str(e)}, 400