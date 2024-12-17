#!/usr/bin/env python3
from models.User import User
from models.Board import Board
from models.Answer import Answer
from models.Question import Question
from models.Media import Media
from models.BoardMedia import BoardMedia

from random import choice, sample
from faker import Faker
from app import app
from config import db

def seed_data():
    with app.app_context():
        try:
            print("Starting seed...")

            # Clear existing data
            db.session.query(BoardMedia).delete()
            db.session.query(Media).delete()
            db.session.query(Answer).delete()
            db.session.query(Question).delete()
            db.session.query(Board).delete()
            db.session.query(User).delete()
            db.session.commit()

            faker = Faker()

            # Create Test User
            test_user = User(
                username="testuser",
                email="test@example.com"
            )
            test_user.password = "Testing@12345"  # Password is hashed via setter
            db.session.add(test_user)
            db.session.commit()
            print("Test user created: email=test@example.com, password=Testing@12345")

            # Add Boards for Test User
            test_boards = [
                Board(user_id=test_user.id, board_name="Birthday Board", board_type="birthday"),
                Board(user_id=test_user.id, board_name="Year Recap Board", board_type="yearly recap"),
                Board(user_id=test_user.id, board_name="Celebration Board", board_type="celebration"),
                Board(user_id=test_user.id, board_name="Other Board", board_type="other"),
            ]
            db.session.add_all(test_boards)
            db.session.commit()
            print(f"Added {len(test_boards)} boards for test user.")

            # Hardcoded Questions (Provided Data)
            questions_data = {
                "birthday": [
                    "What’s one moment from today that deserves a permanent spot in your memory?",
                    "What was the best thing about the way you celebrated this birthday?",
                    "What’s a photo from today that perfectly sums up the vibe of your birthday?",
                ],
                "yearly recap": [
                    "What’s one photo from this year that captures your happiest moment? Why?",
                    "Describe a scene from a place you visited this year that you’ll never forget.",
                    "What’s one goal you achieved this year? Picture yourself in that moment.",
                ],
                "celebration": [
                    "What’s the most joyful part of this celebration? What made it special?",
                    "Describe the decorations from this celebration that left a lasting impression on you.",
                    "What’s one photograph from this celebration that sums up its energy and meaning?",
                ],
                "other": [
                    "What’s one small moment that made you smile unexpectedly?",
                    "Describe what made you pause and take it all in.",
                ],
            }

            # Add Questions
            questions = []
            for board_type, texts in questions_data.items():
                for text in texts:
                    question = Question(text=text, board_type=board_type)
                    questions.append(question)
            db.session.add_all(questions)
            db.session.commit()
            print(f"Added {len(questions)} questions.")

            print("Seeding complete!")

        except Exception as e:
            db.session.rollback()
            print(f"Error during seeding: {e}")
        finally:
            db.session.remove()

if __name__ == "__main__":
    seed_data()
