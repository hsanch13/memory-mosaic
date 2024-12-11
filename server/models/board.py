from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

# Model set up
class Board(db.Model, SerializerMixin):
    __tablename__ = "boards"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    board_type = db.Column(db.String(100), nullable=False, index=True)
    board_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationship
    user = relationship("User", back_populates="boards")
    answers = relationship("Answer", back_populates="board", cascade="all, delete-orphan")

    #Serialization rules
    serialize_rules = ("-answers", "-user")

    #Validations
    @validates("board_type")
    def validate_board_type(self, _, value):
        valid_boards = [
            "birthday", "yearly recap", "celebration"
        ]
        if not isinstance(value, str):
            raise ValueError("your topic must be a string")
        if value.lower() not in valid_boards:
            raise ValueError(f"your topic is not one of these valid topics: {valid_boards}")
        return value.lower()

    @validates("board-name")
    def validate_board_name(self, _, value):
        if not isinstance(value, str):
            raise ValueError("your board name must be a string")
        if value not in range (1, 101):
            raise ValueError("your board name must be between 1 and 100 characters")
        return value
    
    def __repr__(self):
        return f'<Board {self.board_name} is a {self.board_type} board>'