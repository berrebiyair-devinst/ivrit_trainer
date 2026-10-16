const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json());



app.get('/api/words', async (req, res) => {
    try {
        const words = await db('words').select('*');
        res.json(words);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to load words'
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

app.put('/api/words/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { hebrew, english } = req.body;

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

    try {
        const [word] = await db('words')
            .where({ id })
            .update({
                hebrew: hebrew.trim(),
                english: english.trim()
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

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

app.post('/api/words', async (req, res) => {
    const { hebrew, english } = req.body;

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

    try {
        const [word] = await db('words')
            .insert({
                hebrew: hebrew.trim(),
                english: english.trim()
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

app.use(express.static('public'));