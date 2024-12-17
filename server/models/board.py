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
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    board_type = db.Column(db.String(100), nullable=False, index=True)
    board_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    user = db.relationship("User", back_populates="boards")
    answers = db.relationship("Answer", back_populates="board", cascade="all, delete-orphan")
    board_media = db.relationship("BoardMedia", back_populates="board", cascade="all, delete-orphan")

    # Serialization Rules
    serialize_rules = ("-user", "-answers", "-board_media")

    # Validations
    @validates("board_type")
    def validate_board_type(self, _, value):
        valid_boards = ["birthday", "yearly recap", "celebration", "other"]
        if not isinstance(value, str):
            raise ValueError("Board type must be a string")
        if value.lower() not in valid_boards:
            raise ValueError(f"Invalid board type: {value}. Must be one of {valid_boards}.")
        return value.lower()

    @validates("board_name")
    def validate_board_name(self, _, value):
        if not isinstance(value, str) or len(value.strip()) == 0:
            raise ValueError("Board name must be a non-empty string")
        if len(value) > 100:
            raise ValueError("Board name must be 100 characters or less")
        return value.strip()

    def __repr__(self):
        return f"<Board {self.board_name} ({self.board_type})>"