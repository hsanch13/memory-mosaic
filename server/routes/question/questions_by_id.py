from models import Question 
from flask import make_response
from flask_restful import Resource

# route to get questions by id 
class QuestionsById(Resource):
    def get(self, id):
        try:
            question = Question.query.get(id)
            if not question:
                return make_response({"error": f"Question with id {id} not found"}, 404)
            return make_response(question.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)