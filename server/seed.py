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

            # Seed a test user with known credentials
            test_user = User(
                username="testuser",
                email="test@example.com"
            )
            test_user.password = "Test@12345!"  # Hashes password using the setter
            db.session.add(test_user)
            db.session.commit()
            print("Test user seeded: email=test@example.com, password=Test@12345")

            # Seed additional users
            users = [test_user]  # Start with the test user
            for _ in range(4):  # Add 4 more random users
                email = faker.unique.email()
                user = User(
                    username=faker.user_name(),
                    email=email
                )
                user.password = "Pass@12345!"  # Assign random password
                users.append(user)

            db.session.add_all(users)
            db.session.commit()

            # Seed Boards
            board_types = ["birthday", "yearly recap", "celebration", "other"]
            boards = [
                Board(
                    user_id=choice(users).id,
                    board_type=board_type,
                    board_name=f"{faker.catch_phrase()} {board_type.capitalize()} Board",
                )
                for board_type in board_types
            ]
            db.session.add_all(boards)
            db.session.commit()

            # Hardcoded Questions
            questions_data = {
                "birthday": [
                    "What’s one moment from today that deserves a permanent spot in your memory?",
                    "What was the best thing about the way you celebrated this birthday?",
                    "What’s a photo from today that perfectly sums up the vibe of your birthday?",
                    "What’s one thing someone did or said today that made you feel extra loved?",
                    "If you could keep just one thing from this birthday forever (besides memories), what would it be?",
                ],
                "yearly recap": [
                    "What’s one photo from this year that captures your happiest moment? Why?",
                    "Describe a scene from a place you visited this year that you’ll never forget.",
                    "What’s one goal you achieved this year? Picture yourself in that moment.",
                    "If your year was a color palette, what colors would dominate it?",
                    "What’s one unexpected moment this year that turned out to be magical?",
                ],
                "celebration": [
                    "What’s the most joyful part of this celebration? What made it special?",
                    "Describe the decorations from this celebration that left a lasting impression on you.",
                    "What’s a moment during this celebration where you couldn’t stop smiling?",
                    "What’s one photograph from this celebration that sums up its energy and meaning?",
                    "What’s the most heartfelt toast or speech or gesture you’ve heard or saw at this celebration?",
                ],
                "other": [
                    "What’s one small moment that made you smile unexpectedly?",
                    "Describe what made you pause and take it all in.",
                    "Is there an object, big or small, that feels meaningful? Why?",
                    "If you could capture one conversation in a photo, what would it look like?",
                    "What’s one thing about your surroundings that feels comforting or inspiring?",
                ],
            }

            # Seed Questions
            questions = []
            for board_type, texts in questions_data.items():
                for text in texts:
                    question = Question(text=text, board_type=board_type)
                    questions.append(question)
            db.session.add_all(questions)
            db.session.commit()

            # Seed Answers
            answers = []
            for board in boards:
                board_questions = [q for q in questions if q.board_type == board.board_type]
                for question in board_questions:
                    answer = Answer(
                        board_id=board.id,
                        question_id=question.id,
                        answer_text=faker.sentence(nb_words=10),
                    )
                    answers.append(answer)
            db.session.add_all(answers)
            db.session.commit()

            # Seed Media
            media_items = []
            for answer in answers:
                if faker.boolean(chance_of_getting_true=90):  # 90% chance to add media
                    media = Media(
                        answer_id=answer.id,
                        url=faker.image_url(),
                    )
                    media_items.append(media)
            db.session.add_all(media_items)
            db.session.commit()

            # Seed BoardMedia (Avoid Duplicates)
            board_media_pairs = set()
            board_media_items = []
            for board in boards:
                for media in sample(media_items, min(len(media_items), 3)):
                    if (board.id, media.id) not in board_media_pairs:
                        board_media_pairs.add((board.id, media.id))
                        board_media_items.append(BoardMedia(board_id=board.id, media_id=media.id))
            db.session.add_all(board_media_items)
            db.session.commit()

            print("Seeding complete!")

        except Exception as e:
            db.session.rollback()
            print(f"Error during seeding: {e}")
        finally:
            db.session.remove()

if __name__ == "__main__":
    seed_data()
