#!/usr/bin/env python3
from models import User, Board, Question, Answer, Media, BoardMedia

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db

if __name__ == "__main__":
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

faker = Faker()

def seed_data():
    with app.app_context():
        # Clear existing data
        BoardMedia.query.delete()
        Media.query.delete()
        Answer.query.delete()
        Question.delete()
        Board.delete()
        User.delete()
        db.session.commit()

        # Seed Users with Faker
        users = []
        for _ in range(5):  # Generate 5 users
            user = User(
                username=faker.user_name(),
                email=faker.email(),
                password="Pass@1234",  # Set a default password for simplicity
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()

        # Seed Boards with Faker
        board_types = ["birthday", "yearly recap", "celebration", "other"]
        boards = []
        for i, board_type in enumerate(board_types):
            board = Board(
                user_id=users[i % len(users)].id,  # Assign boards to users cyclically
                board_type=board_type,
                board_name=f"{faker.word().capitalize()} {board_type.capitalize()} Board",
            )
            boards.append(board)
        db.session.add_all(boards)
        db.session.commit()

        # Manually Seed Questions
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
            "What’s one thing about your surroundings feels comforting or inspiring?",
            ],
        }

        questions = []
        for board_type, questions_list in questions_data.items():
            for text in questions_list:
                question = Question(text=text, board_type=board_type)
                questions.append(question)
        db.session.add_all(questions)
        db.session.commit()

        # Seed Answers and Media with Faker
        answers = []
        media_items = []
        for board in boards:
            for _ in range(5):  # Generate 5 answers per board
                answer = Answer(
                    board_id=board.id,
                    question_id=faker.random_element(questions).id,
                    answer_text=faker.sentence(nb_words=10),
                )
                answers.append(answer)
                db.session.add(answer)
                db.session.commit()  # Commit to ensure answer IDs are available

                # Add Media to some answers
                if faker.boolean(
                    chance_of_getting_true=50
                ):  # 50% chance of having media
                    media = Media(answer_id=answer.id, url=faker.image_url())
                    media_items.append(media)
        db.session.add_all(media_items)
        db.session.commit()

        # Seed BoardMedia with Faker
        board_media_items = []
        for board in boards:
            for _ in range(3):  # Attach 3 media items per board
                board_media = BoardMedia(
                    board_id=board.id, media_id=faker.random_element(media_items).id
                )
                board_media_items.append(board_media)
        db.session.add_all(board_media_items)
        db.session.commit()

        print("Seeding complete!")


if __name__ == "__main__":
    seed_data()
