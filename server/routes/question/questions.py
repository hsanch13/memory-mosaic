from models import Question 
from flask_migrate import Migrate
from flask import request, make_response
from flask_restful import Resource
from config import app, db, api

###CRUD FOR QUESTIONS
class Questions(Resource):
    def get(self, id=None):
        try:
            if id:
                question = Question.query.get(id)
                if not question:
                    return make_response({"error": f"Question with id {id} not found"}, 404)
                return make_response(question.to_dict(), 200)
            questions = Question.query.all()
            return make_response([question.to_dict() for question in questions], 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def post(self):
        try:
            data = request.get_json()
            new_question = Question(
                prompt=data["prompt"]
            )
            db.session.add(new_question)
            db.session.commit()
            return make_response(new_question.to_dict(), 201)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def patch(self, id):
        try:
            question = Question.query.get(id)
            if not question:
                return make_response({"error": f"Question with id {id} not found"}, 404)
            data = request.get_json()
            question.prompt = data.get("prompt", question.prompt)
            db.session.commit()
            return make_response(question.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def delete(self, id):
        try:
            question = Question.query.get(id)
            if not question:
                return make_response({"error": f"Question with id {id} not found"}, 404)
            db.session.delete(question)
            db.session.commit()
            return make_response({"message": f"Question with id {id} deleted"}, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)