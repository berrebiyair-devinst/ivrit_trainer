const wordsList = document.getElementById('words-list');
const message = document.getElementById('message');
const wordForm = document.getElementById('word-form');
const hebrewInput = document.getElementById('hebrew');
const englishInput = document.getElementById('english');
const submitButton = wordForm.querySelector('button[type="submit"]');

let editingWordId = null;

function resetForm() {
    editingWordId = null;
    wordForm.reset();
    submitButton.textContent = 'Add word';
}

async function loadWords() {
    wordsList.textContent = 'Loading words...';

    try {
        const response = await fetch('/api/words');

        if (!response.ok) {
            throw new Error('Unable to load words');
        }

        const words = await response.json();

        wordsList.replaceChildren();

        if (words.length === 0) {
            wordsList.textContent = 'No words yet. Add your first word!';
            return;
        }

        words.forEach((word) => {
            const card = document.createElement('article');
            card.className = 'word-card';

            const hebrew = document.createElement('h3');
            hebrew.textContent = word.hebrew;
            hebrew.lang = 'he';
            hebrew.dir = 'rtl';

            const english = document.createElement('p');
            english.textContent = word.english;

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = 'Edit';

            editButton.addEventListener('click', () => {
                editingWordId = word.id;
                hebrewInput.value = word.hebrew;
                englishInput.value = word.english;
                submitButton.textContent = 'Save changes';
                message.textContent = 'Edit the word, then save your changes.';
                hebrewInput.focus();
            });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Delete';

            deleteButton.addEventListener('click', async () => {
                if (!confirm(`Delete "${word.english}"?`)) {
                    return;
                }

                deleteButton.disabled = true;

                try {
                    const response = await fetch(`/api/words/${word.id}`, {
                        method: 'DELETE'
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Unable to delete word');
                    }

                    if (editingWordId === word.id) {
                        resetForm();
                    }

                    message.textContent = 'Word deleted successfully!';
                    await loadWords();
                } catch (error) {
                    message.textContent = error.message;
                    deleteButton.disabled = false;
                }
            });

            card.append(hebrew, english, editButton, deleteButton);
            wordsList.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        wordsList.textContent = 'Unable to load words. Please try again.';
    }
}

wordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const hebrew = hebrewInput.value.trim();
    const english = englishInput.value.trim();

    if (!hebrew || !english) {
        message.textContent = 'Please fill in both fields.';
        return;
    }

    const isEditing = editingWordId !== null;

    const url = isEditing
        ? `/api/words/${editingWordId}`
        : '/api/words';

    const method = isEditing ? 'PUT' : 'POST';

    submitButton.disabled = true;
    wordsList.querySelectorAll('button').forEach((button) => {
        button.disabled = true;
    });
    message.textContent = 'Saving...';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hebrew, english })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to save word');
        }

        resetForm();

        message.textContent = isEditing
            ? 'Word updated successfully!'
            : 'Word added successfully!';

        await loadWords();
        hebrewInput.focus();
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
        wordsList.querySelectorAll('button').forEach((button) => {
            button.disabled = false;
        });
    }
});

loadWords();

const startQuizButton = document.getElementById('start-quiz');
const quizArea = document.getElementById('quiz-area');
const quizProgress = document.getElementById('quiz-progress');
const quizWord = document.getElementById('quiz-word');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const nextQuestionButton = document.getElementById('next-question');
const quizResult = document.getElementById('quiz-result');

let quizWords = [];
let quizQuestions = [];
let questionIndex = 0;
let score = 0;
let answered = false;

function shuffle(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function showQuestion() {
    const currentWord = quizQuestions[questionIndex];

    answered = false;
    quizFeedback.textContent = '';
    nextQuestionButton.hidden = true;
    quizOptions.replaceChildren();

    quizProgress.textContent =
        `Question ${questionIndex + 1} of ${quizQuestions.length}`;

    quizWord.textContent = currentWord.hebrew;

    const otherTranslations = [
        ...new Set(
            quizWords
                .map((word) => word.english)
                .filter((english) => english !== currentWord.english)
        )
    ];

    const wrongAnswers = shuffle(otherTranslations).slice(0, 3);

    const options = shuffle([
        currentWord.english,
        ...wrongAnswers
    ]);

    options.forEach((translation) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.textContent = translation;

        button.addEventListener('click', () => {
            if (answered) {
                return;
            }

            answered = true;

            if (translation === currentWord.english) {
                score++;
                quizFeedback.textContent = 'Correct!';
            } else {
                quizFeedback.textContent =
                    `Incorrect. The correct answer is: ${currentWord.english}`;
            }

            quizOptions.querySelectorAll('button').forEach((option) => {
                option.disabled = true;
            });

            nextQuestionButton.textContent =
                questionIndex === quizQuestions.length - 1
                    ? 'See results'
                    : 'Next question';

            nextQuestionButton.hidden = false;
            nextQuestionButton.focus();
        });

        quizOptions.appendChild(button);
    });
}

startQuizButton.addEventListener('click', async () => {
    startQuizButton.disabled = true;
    quizResult.textContent = 'Loading quiz...';
    quizArea.hidden = true;

    try {
        const response = await fetch('/api/words');

        if (!response.ok) {
            throw new Error('Unable to load quiz');
        }

        quizWords = await response.json();

        const uniqueTranslations = new Set(
            quizWords.map((word) => word.english)
        );

        if (uniqueTranslations.size < 4) {
            throw new Error(
                'Add at least 4 different English translations to start a quiz.'
            );
        }

        quizQuestions = shuffle(quizWords).slice(0, 10);
        questionIndex = 0;
        score = 0;

        quizResult.textContent = '';
        startQuizButton.hidden = true;
        quizArea.hidden = false;

        showQuestion();
    } catch (error) {
        quizResult.textContent = error.message;
    } finally {
        startQuizButton.disabled = false;
    }
});

nextQuestionButton.addEventListener('click', () => {
    if (!answered) {
        return;
    }

    answered = false;
    questionIndex++;

    if (questionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        quizArea.hidden = true;

        quizResult.textContent =
            `Quiz complete! Your score: ${score} / ${quizQuestions.length}`;

        startQuizButton.textContent = 'Try again';
        startQuizButton.hidden = false;
        startQuizButton.focus();
    }
});