from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
import re
from werkzeug.security import generate_password_hash, check_password_hash


# Model set
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True, index=True)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now()
    )

    # Relationship
    boards = db.relationship("Board", back_populates="user", cascade="all, delete-orphan")

    # Serialization rules
    serialize_rules = ["-boards.user", "-password"]

    # Validation for username
    @validates("username")
    def validate_username(self, _, value):
        if not isinstance(value, str):
            raise ValueError("your username must be a string")
        if not value.strip():  # makes sure username is not empty
            raise ValueError("your username cannot be empty")
        return value

    # Validation for email
    @validates("email")
    def validate_email(self, _, value):
        if not isinstance(value, str):
            raise ValueError("your email must be a string")
        #  regex -- makes sure email is in a valid format
        email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(email_regex, value):
            raise ValueError("your email must be a valid format (e.g., xxx@xxx.com)")
        # Check for uniqueness
        existing_user = User.query.filter_by(email=value).first()
        if existing_user:
            raise ValueError("this email is already in use")
        return value

    # Validation for password
    @validates("password")
    def validate_password(self, _, value):
        if not isinstance(value, str):
            raise ValueError("Your password must be a string")
        if len(value) < 8:
            raise ValueError("Your password must be at least 8 characters long")
        password_regex = r"^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$"
        if not re.match(password_regex, value):
            raise ValueError("your password must contain at least one capital letter, one symbol AND one number")
        return generate_password_hash(value)

    def __repr__(self):
        return f"<User: {self.username}, Email: {self.email}>"
