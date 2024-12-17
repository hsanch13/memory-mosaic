from routes.__init__ import Resource, request, make_response, session
from models.User import User
import traceback

class Login(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get("email", "").strip()
            password = data.get("password", "").strip()

            # Fetch user by email
            user = User.query.filter_by(email=email).first()
            if user and user.authenticate(password):
                session["user_id"] = user.id  # Save user_id in session
                return make_response({
                    "message": "Login successful",
                    "user": {"id": user.id, "username": user.username, "email": user.email}
                }, 200)
            else:
                return make_response({"error": "Invalid Credentials"}, 401)
        except Exception as e:
            print(traceback.format_exc())
            return make_response({"error": str(e)}, 400)