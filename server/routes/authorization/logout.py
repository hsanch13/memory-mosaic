from routes.__init__ import Resource, make_response, session

class Logout(Resource):
    def delete(self):
        try:
            session.clear()  # clears all session data
            return make_response({"message": "Logout successful"}, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)