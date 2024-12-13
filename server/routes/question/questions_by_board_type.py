from models import Question 
from flask import make_response
from flask_restful import Resource

#route to get questions based on the kind of board it is
class QuestionsByBoardType(Resource):
    def get(self, board_type):
        try:
            questions = Question.query.filter_by(board_type=board_type).all()
            if not questions:
                return make_response({"error": f"No questions found for board type {board_type}"}, 404)
            return make_response([question.to_dict() for question in questions], 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)