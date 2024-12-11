from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

# Model set up
class Answer(db.Model, SerializerMixin):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey("board.id"), nullable=False, index=True)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False, index=True)
    answer_text = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationship
    board = db.relationship("Board", back_populates="answers")
    question = db.relationship("Question", back_populates="answers")
    media = db.relationship("Media", back_populates="answer", cascade="all, delete-orphan")

    # Serialization rules
    serialize_rules = ["-board", "-question", "-media"]

    # Validations
    @validates("answer_text")
    def validate_answer_text(self, _, value):
        if not isinstance(value, str):
            raise ValueError("answer text must be a string.")
        if not (1 <= len(value) <= 500):
            raise ValueError("answer text must be between 1 and 500 characters")
        return value

    def __repr__(self):
        return f"<Answer {self.answer_text}>"
