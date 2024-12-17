from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

class BoardMedia(db.Model, SerializerMixin):
    __tablename__ = "board_media"

    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey("boards.id"), nullable=False, index=True)
    media_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=False, index=True)

    # Relationships
    media = db.relationship("Media", back_populates="board_media")
    board = db.relationship("Board", back_populates="board_media")

    # Serialization
    serialize_rules = ("-board", "-media")

    # Validation for unique pairs
    @validates("board_id", "media_id")
    def validate_unique_pair(self, key, value):
        # Only validate for new objects
        if not self.id:
            existing_pair = BoardMedia.query.filter_by(
                board_id=self.board_id or value, media_id=self.media_id or value
            ).first()
            if existing_pair:
                raise ValueError("This media is already associated with this board.")
        return value

    def __repr__(self):
        return f"<BoardMedia Board ID: {self.board_id}, Media ID: {self.media_id}>"