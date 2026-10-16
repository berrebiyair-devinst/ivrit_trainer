CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    hebrew VARCHAR(100) NOT NULL,
    english VARCHAR(150) NOT NULL
);

INSERT INTO words (hebrew, english)
SELECT initial_words.hebrew, initial_words.english
FROM (
    VALUES
        ('יכולת', 'Ability'),
        ('משימה', 'Task'),
        ('הצלחה', 'Success'),
        ('עבודה', 'Work'),
        ('שלום', 'Peace / Hello')
) AS initial_words(hebrew, english)
WHERE NOT EXISTS (
    SELECT 1
    FROM words
    WHERE words.hebrew = initial_words.hebrew
      AND words.english = initial_words.english
);