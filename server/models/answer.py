from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
import re


# Model set up
class Answer(db.Model):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey("board.id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)
    answer_text = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationship
    board = db.relationship("Board", back_populates="answers")
    question = db.relationship("Question", back_populates="answers")
    media = db.relationship("Media", back_populates="answer")

    # Serialization rules

    # Validations

    def __repr__(self):
        return f"<Answer {self.answer_text}>"
