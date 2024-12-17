from routes.__init__ import Resource, request, db, make_response, session
from models.User import User
from sqlalchemy.exc import IntegrityError

class Signup(Resource):
    def post(self): 
        try:
            # Get input data
            data = request.json
            email = data.get("email")
            username = data.get("username")
            password = data.get("password")

            # Validate input data
            if not email or not username or not password:
                return {"error": "All fields (email, username, password) are required"}, 400

            # Create and save the new user
            user = User(email=email, username=username)
            user.password = password  # Hashes the password using setter
            db.session.add(user)
            db.session.commit()

            # Set session
            session["user_id"] = user.id
            return make_response(user.to_dict(), 201)

        except IntegrityError:
            db.session.rollback()
            return {"error": "Email or username already exists"}, 422
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
