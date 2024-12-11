from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
import re

# Model set up
class Board(db.Model):
    __tablename__ = "boards"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    board_type = db.Column(db.String(50), nullable=False)
    board_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationship
    user = db.relationship('User', back_populates='boards')
    answers = db.relationship('Answer', back_populates='board')

    #Serialization rules

    #Validations


    def __repr__(self):
        return f'<Board {self.board_name} is a {self.board_type} board>'

