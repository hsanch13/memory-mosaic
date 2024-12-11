from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
import re


# Model set up
class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    board_type = db.Column(db.String(50), nullable=False)

    # Relationships
    answers = db.relationship("Answer", back_populates="question")

    # Serialization rules

    # Validations


def __repr__(self):
    return f"<Question {self.text}>"
