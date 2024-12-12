from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

class BoardMedia(db.Model, SerializerMixin):
    __tablename__ = "board_media"

    id = db.Column(db.Integer, primary_key=True)
    media_id = db.Column(db.Integer, db.ForeignKey("media.id"), nullable=False, index=True)
    board_id = db.Column(db.Integer, db.ForeignKey("board.id"), nullable=False, index=True)

    #Relationship
    media = db.relationship("Media", back_populates="board_media")
    board = db.relationship("Board", back_populates="board_media")

    #Serialization
    serialize_rules = ("-board.board_media", "-media.board_media")

    #Validation
    @validates("board_id", "media_id") #makes sure same media can't be used on the board more than once to maintain uniqueness
    def validate_unique_pair(self, _, value):
        existing_pair = db.session.query(BoardMedia).filter_by(board_id=self.board_id, media_id=self.media_id).first()
        if existing_pair:
            raise ValueError("This media is already associated with this board.")
        return value
    
    def __repr__(self):
        return f'<BoardMedia ID: {self.board_id}, Media ID:{self.media_id}, Board ID: {self.board_id}>'