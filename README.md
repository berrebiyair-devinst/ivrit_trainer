# Ivrit Trainer

A Hebrew vocabulary app built for the Developers Institute hackathon.

Users can save Hebrew words with English translations and practise through multiple-choice quizzes.

## Author

Yair Berrebi — solo project.

## Features

- Add, view, edit and delete vocabulary.
- Store vocabulary in PostgreSQL.
- Practise with up to 10 randomly selected questions.
- Get immediate answer feedback and a final score.

A quiz requires at least four different English translations.
Quiz scores are currently kept only in the browser during the quiz.

## Technologies

HTML, CSS, JavaScript, Node.js, Express, PostgreSQL, Knex and dotenv.

## Run locally

### 1. Install dependencies

Install Node.js and PostgreSQL, then run:

```bash
git clone https://github.com/berrebiyair-devinst/ivrit_trainer.git
cd ivrit_trainer
npm install
```

### 2. Set up the database

In pgAdmin:

1. Create a database named `ivrit_trainer`.
2. Open the Query Tool for that database.
3. Open `database/setup.sql` and execute it.

The script creates the words table and inserts starter vocabulary.

### 3. Configure the connection

Copy `.env.example` to a new file named `.env`.

Update the values with your PostgreSQL connection details.
The default PostgreSQL port is 5432; change it if your installation uses another port.

Do not commit your `.env` file.

### 4. Start the server

```bash
node server.js
```

Open http://localhost:3000 in your browser.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/words | Get all words |
| POST | /api/words | Add a word |
| PUT | /api/words/:id | Update a word |
| DELETE | /api/words/:id | Delete a word |

POST and PUT accept JSON containing `hebrew` and `english`.

## Demo video

To be added before submission.
