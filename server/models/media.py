from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

# Model set up
class Media(db.Model, SerializerMixin):
    __tablename__ = "media"

    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey("answers.id"), nullable=False, index=True)
    url = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    answer = db.relationship("Answer", back_populates="media")
    board_media = db.relationship("BoardMedia", back_populates="media")

    # Serialization Rules
    serialize_rules = ("-answer", "-board_media")

    @validates("url")
    def validate_url(self, _, value):
        if not isinstance(value, str):
            raise ValueError("URL must be a string")
        if not value.startswith("http"):
            raise ValueError("URL must start with 'http'")
        return value

    def __repr__(self):
        return f"<Media {self.url}>"