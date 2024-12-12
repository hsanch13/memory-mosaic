from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

# Model set up
class Question(db.Model, SerializerMixin):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    board_type = db.Column(db.String(50), nullable=False)

    # Relationships
    answers = db.relationship("Answer", back_populates="questions", cascade="all, delete-orphan")

    # Serialization rules
    serialize_rules = ('-answers',)

    # Validations
    @validates('text')
    def validate_text(self, _, value):
        if not isinstance(value, str):
            raise ValueError("question text must be a string.")
        return value

    @validates('board_type')
    def validate_board_type(self, _, value):
        valid_board_types = ['birthday', 'yearly recap', 'celebration', 'other']
        if not isinstance(value, str):
            raise ValueError("Board type must be a string.")
        if value.lower() not in valid_board_types:
            raise ValueError(f"Invalid board type. Valid types are: {valid_board_types}.")
        return value.lower()

    def __repr__(self):
        return f"<Question {self.text}>"
