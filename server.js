const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3001;
const allowedCategories = ['Daily life', 'Army', 'Work'];

app.use(express.json());
app.use(express.static('public'));

app.get('/api/words', async (req, res) => {
    try {
        const words = await db('words')
            .select('*')
            .orderBy('id', 'asc');

        res.json(words);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to load words'
        });
    }
});

app.post('/api/words', async (req, res) => {
    const { hebrew, english, category = 'Daily life' } = req.body;

    if (
        typeof hebrew !== 'string' ||
        typeof english !== 'string' ||
        !hebrew.trim() ||
        !english.trim()
    ) {
        return res.status(400).json({
            message: 'Hebrew and English words are required'
        });
    }

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
            message: 'Invalid category'
        });
    }

    try {
        const [word] = await db('words')
            .insert({
                hebrew: hebrew.trim(),
                english: english.trim(),
                category
            })
            .returning('*');

        res.status(201).json(word);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to add word'
        });
    }
});

app.put('/api/words/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { hebrew, english, category = 'Daily life' } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid word ID'
        });
    }

    if (
        typeof hebrew !== 'string' ||
        typeof english !== 'string' ||
        !hebrew.trim() ||
        !english.trim()
    ) {
        return res.status(400).json({
            message: 'Hebrew and English words are required'
        });
    }

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
            message: 'Invalid category'
        });
    }

    try {
        const [word] = await db('words')
            .where({ id })
            .update({
                hebrew: hebrew.trim(),
                english: english.trim(),
                category
            })
            .returning('*');

        if (!word) {
            return res.status(404).json({
                message: 'Word not found'
            });
        }

        res.json(word);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to update word'
        });
    }
});

app.delete('/api/words/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid word ID'
        });
    }

    try {
        const deletedCount = await db('words')
            .where({ id })
            .del();

        if (deletedCount === 0) {
            return res.status(404).json({
                message: 'Word not found'
            });
        }

        res.json({
            message: 'Word deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to delete word'
        });
    }
});

app.post('/api/words/:id/answer', async (req, res) => {
    const id = Number(req.params.id);
    const { answer } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid word ID'
        });
    }

    if (typeof answer !== 'string' || !answer.trim()) {
        return res.status(400).json({
            message: 'An answer is required'
        });
    }

    try {
        const word = await db('words').where({ id }).first();

        if (!word) {
            return res.status(404).json({
                message: 'Word not found'
            });
        }

        const correct = answer === word.english;

        const counter = correct
            ? 'correct_count'
            : 'incorrect_count';

        const [updatedWord] = await db('words')
            .where({ id })
            .increment(counter, 1)
            .returning('*');

        if (!updatedWord) {
            return res.status(404).json({
                message: 'Word not found'
            });
        }

        res.json({
            correct,
            correctAnswer: word.english,
            word: updatedWord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to save answer'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});