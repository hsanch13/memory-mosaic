from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, flask_bcrypt
import re

# Model set
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True, index=True)
    _password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, server_default=db.func.now(), onupdate=db.func.now()
    )

    # Relationship
    boards = db.relationship("Board", back_populates="user", cascade="all, delete-orphan")

    # Serialization rules
    serialize_rules = ("-boards", "-password")

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
    @hybrid_property
    def password(self):
        raise AttributeError("passwords can only be set, not read.")

    @password.setter
    def password(self, password_to_validate):
        if not isinstance(password_to_validate, str):
            raise TypeError("password must be a string")
        if not 10 < len(password_to_validate) < 20:
            raise ValueError("password must be a string between 10 and 20 characters long")
        hashed_password = flask_bcrypt.generate_password_hash(password_to_validate).decode("utf-8")
        self._password_hash = hashed_password

    def authenticate(self, password_to_check):
        return flask_bcrypt.check_password_hash(self._password_hash, password_to_check)
    
    def __repr__(self):
        return f"<User: {self.username}, Email: {self.email}>"