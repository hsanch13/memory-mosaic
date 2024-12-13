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
from routes.question.questions import Questions
from routes.authorization.current_user import CurrentUser
from routes.authorization.login import Login
from routes.authorization.logout import Logout
from routes.authorization.signup import Signup

app.secret_key="vicky's_secret"

# Views go here!

@app.route('/')
def index():
    return '<h1>Memory Mosaic Server</h1>'

#API ROUTES
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CurrentUser, '/current-user')
api.add_resource(Questions, "/questions", "/questions/<int:id>", "/questions/:boardType")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

