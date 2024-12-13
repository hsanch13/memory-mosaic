#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api

# Add your model imports
from models import Answer, Board, BoardMedia, Media, Question, User

# Add your route imports
from routes.upload.uploads import Uploads
from routes.authorization.current_user import CurrentUser
from routes.authorization.login import Login
from routes.authorization.logout import Logout
from routes.authorization.signup import Signup
from routes.question.questions import Questions
from routes.question.questions_by_id import QuestionsById
from routes.question.questions_by_board_type import QuestionsByBoardType
from routes.board.boards import Boards
from routes.board.boards_by_id import BoardsById

from routes.board_media.board_media import BoardMedia

app.secret_key="vicky's_secret"

# Views go here!

@app.route('/')
def index():
    return '<h1>Memory Mosaic Server</h1>'


#API ROUTES
api.add_resource(Uploads, "/uploads")

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CurrentUser, '/current-user')

api.add_resource(Questions, "/questions")
api.add_resource(QuestionsById, "/questions/<int:id>")
api.add_resource(QuestionsByBoardType, "/questions/board-type/<string:board_type>")

api.add_resource(Boards, "/boards")
api.add_resource(BoardsById, "/boards/<int:id>")

api.add_resource(BoardMedia, "/board-media")




if __name__ == '__main__':
    app.run(port=5555, debug=True)

