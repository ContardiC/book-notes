-- select all the reviewed books

SELECT b.id, b.title, a.fname, a.lname, n.review_text, n.rating  FROM books b JOIN notes n ON b.id = n.id_book JOIN authors a ON b.id_author = a.id;

-- select a book to display notes

SELECT b.id, b.title, a.fname, a.lname, n.review_text, n.rating , n.note FROM books b JOIN notes n on b.id = n.id_book JOIN authors a ON b.id_author = a.id WHERE b.id = $1;