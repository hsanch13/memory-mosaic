from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
import re


# Model set up
class Media(db.Model):
    __tablename__ = "medias"

    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey("answer.id"), nullable=False)
    url = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
    db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationship
    answer = db.relationship("Answer", back_populates="media")

    # Serialization Rules

    # Validations

def __repr__(self):
    return f'<Media {self.url}>'
