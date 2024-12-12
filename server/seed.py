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
                "What was the best gift you received?",
                "Who made your birthday special this year?",
                "What was the most memorable moment?",
                "What was your favorite part of the party?",
                "How did you feel about turning this age?",
            ],
            "yearly recap": [
                "What was your biggest achievement this year?",
                "What was a challenge you overcame?",
                "Who inspired you the most this year?",
                "What new skill or habit did you develop?",
                "What was your favorite memory of the year?",
            ],
            "celebration": [
                "What are you celebrating today?",
                "Who are you grateful to celebrate with?",
                "What was the most fun moment of the celebration?",
                "What made this celebration unique?",
                "What’s something you’ll always remember about today?",
            ],
            "other": [
                "What inspired this board?",
                "Who is this board dedicated to?",
                "What do you hope to remember from this?",
                "What made you create this board?",
                "What does this board mean to you?",
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
