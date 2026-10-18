# Ivrit Trainer

My second hackathon project at Developers Institute.

I'm learning Hebrew myself, so I wanted to build something I could actually use to practise vocabulary.

The idea is simple: save Hebrew words with their English translations, then practise them in a quiz.

## What you can do

- Add your own words
- Edit or delete them
- Choose a category: Daily life, Army or Work
- Take a quiz with all words or just one category
- See your score and the correct answers
- See how many times you got each word right or wrong

The words and the correct/wrong answer counters are saved in PostgreSQL, so they stay after refreshing the page.

The final quiz score is only shown for the current quiz.

## Built with

HTML, CSS and JavaScript for the page.

Node.js and Express for the server, PostgreSQL for the database.
I used Knex for database queries and dotenv for the connection settings.

## How to run it

You need Node.js and PostgreSQL installed.

Clone the project and install the packages:

```bash
git clone https://github.com/berrebiyair-devinst/ivrit_trainer.git
cd ivrit_trainer
npm install
```

In pgAdmin, create a database called `ivrit_trainer`.
Open its Query Tool and run the file `database/setup.sql`.

Then copy `.env.example` to a new file called `.env` and put your own PostgreSQL settings in it.

Check the database port too: PostgreSQL usually uses 5432, but my local installation uses 12345.

Start the app:

```bash
node server.js
```

Then open http://localhost:3001

For the quiz, you need at least 4 different English translations in the database. The setup script adds 5 starter words.

If you choose a category, the questions come from that category, but the other answer choices can come from the full vocabulary list.

## How it works

The browser sends requests with fetch to the Express server.
The server reads or updates the words in PostgreSQL using Knex.

For quiz answers, the server checks the selected translation and updates the correct or incorrect counter.

## Things I would add later

- A way to practise only difficult words
- User accounts so everyone has their own vocabulary
- Put the app online so I can use it on my phone

For now, this is a single shared vocabulary list without user accounts.

## Demo

Video link: https://www.loom.com/share/99469f3d3221405d85c0a79298eed8f3

Made by Yair Berrebi