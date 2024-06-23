CREATE TABLE authors(
    id SERIAL PRIMARY KEY,
    fname VARCHAR(100),
    lname VARCHAR(100),
    biography TEXT
);

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
-- The current size is 13 characters without hyphens, I have chosen 20 for future development of the ISBN code
-- The author ID does not have the not null constraint in case you don't know who wrote the book

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    id_author INTEGER REFERENCES authors(id),
    id_category INTEGER NOT NULL REFERENCES categories(id),
    isbn VARCHAR(20), 
    summary TEXT,
    reading_date DATE
);

CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    id_book INTEGER NOT NULL REFERENCES books(id),
    review_text TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    note TEXT,
    review_date DATE DEFAULT CURRENT_DATE
);