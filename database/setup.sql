CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    hebrew VARCHAR(100) NOT NULL,
    english VARCHAR(150) NOT NULL
);

ALTER TABLE words
ADD COLUMN IF NOT EXISTS category VARCHAR(30)
    NOT NULL DEFAULT 'Daily life',
ADD COLUMN IF NOT EXISTS correct_count INTEGER
    NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS incorrect_count INTEGER
    NOT NULL DEFAULT 0;

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