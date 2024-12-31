# Memory Mosaic

## Learning Goals

- Understand the flow and structure of a full-stack Flask/React application.
- Learn how to build a dynamic, visually engaging app with advanced features such as animations and media uploads.
- Explore the implementation of a many-to-many relationship using a join table in SQLAlchemy.
- Gain experience with global state management using `useContext` in React.

---

## Introduction

Memory Mosaic is a full-stack application that lets users create personalized, interactive memory boards. Users can choose from different board types (Birthday, Yearly Recap, Celebration, or Other), answer predefined questions, and upload photos and videos. Completed boards are displayed with engaging CSS animations, offering a delightful user experience.

---

## Directory Structure

The Memory Mosaic app is structured as follows:

```console
$ tree -L 2
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── README.md
├── client
│   ├── public
│   └── src
├── server
│   ├── app.py
│   ├── config.py
│   ├── models
│   ├── routes
│   └── seed.py
```

The `client` directory contains the React frontend, while the `server` directory houses the Flask backend. Together, these components form the backbone of Memory Mosaic.

---

## Setup

### Backend (`server/`)

The `server/` directory contains the Flask backend for Memory Mosaic. Key files include:

- **`app.py`**: The main entry point for the Flask application. It sets up the API routes and starts the server.
- **`config.py`**: Configures the app, including the database URI and CORS settings.
- **`models/`**: Defines the database models, including `User`, `Board`, `Answer`, `Media`, and `BoardMedia`.
- **`routes/`**: Contains the Flask-RESTful routes for handling CRUD operations.
- **`seed.py`**: Seeds the database with initial data for testing.

To set up the backend, run:

```console
pipenv install
pipenv shell
python server/app.py
```

The backend runs on `http://localhost:5555`.

### Frontend (`client/`)

The `client/` directory contains the React frontend. Key directories and files include:

- **`src/`**: Contains the main application code, including components, contexts, and styles.
- **`components/`**: Houses React components such as `Login`, `Dashboard`, `CreateBoard`, and `BoardForm`.
- **`GlobalContext.js`**: Manages global state using `useContext`.
- **`animations/`**: Contains custom CSS animations for the interactive board layouts.

To set up the frontend, run:

```console
npm install --prefix client
npm start --prefix client
```

The frontend runs on `http://localhost:3000`.

### Database Setup

Memory Mosaic uses Flask-SQLAlchemy and Flask-Migrate for database management. To initialize the database, navigate to the `server/` directory and run:

```console
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

Run `seed.py` to populate the database with sample data:

```console
python server/seed.py
```

---

## Features

### User Authentication

Users can sign up and log in to manage their boards. Passwords are securely hashed using Flask-Bcrypt.

### CRUD Functionality

- **Boards**: Create, view, edit, and delete boards.
- **Answers**: Add, edit, and delete answers to predefined questions.
- **Media**: Upload and manage photos and videos.

### Dynamic Animations

Boards are displayed with custom CSS animations tailored to each board type, providing a polished user experience.

### Many-to-Many Relationships

The `BoardMedia` join table links Boards and Media, enabling boards to showcase multiple media items.

---

## Pages and Routes

### Backend Endpoints

| Method | Endpoint                 | Description                       |
|--------|--------------------------|-----------------------------------|
| POST   | `/signup`                | Create a new user                |
| POST   | `/login`                 | Authenticate a user              |
| GET    | `/boards`                | Fetch all boards for a user      |
| POST   | `/boards`                | Create a new board               |
| GET    | `/boards/:id`            | Fetch a specific board           |
| PATCH  | `/boards/:id`            | Update a board                   |
| DELETE | `/boards/:id`            | Delete a board                   |
| GET    | `/questions/:boardType`  | Fetch questions for a board type |

### Frontend Routes

| Path                 | Component       | Description                      |
|----------------------|-----------------|----------------------------------|
| `/`                  | `Login`        | User login page                  |
| `/signup`            | `SignUp`       | User signup page                 |
| `/dashboard`         | `Dashboard`    | User dashboard with all boards   |
| `/create-board`      | `CreateBoard`  | Board selection page             |
| `/create-board/:boardType` | `BoardForm` | Questionnaire for board creation |
| `/boards/:id`        | `BoardBuilder` | Display completed board          |
| `/edit-board/:id`    | `EditBoard`    | Edit an existing board           |

---

## Conclusion

Memory Mosaic is a comprehensive full-stack application that demonstrates CRUD functionality, advanced CSS animations, and robust backend/frontend integration. It serves as a strong example of modern web development practices and provides a delightful user experience.

---

## Resources

- [React Router Documentation](https://reactrouter.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

