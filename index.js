import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// DB data
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "root",
  port: 5432,
});
// DB connection
db.connect();

const app = express();
const port = 3000;
//body parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
// access local resources
app.use(express.static("public"));

async function getBooks() {
  const result = await db.query(
    "SELECT b.id, b.title, a.fname, a.lname, n.review_text, n.rating  FROM books b JOIN notes n ON b.id = n.id_book JOIN authors a ON b.id_author = a.id;"
  );
  return result.rows;
}

async function getBook(id) {
  const result = await db.query(
    "SELECT b.title, a.fname, a.lname, n.review_text, n.rating , n.note FROM books b JOIN notes n on b.id = $1 JOIN authors a ON b.id_author = a.id;",
    [id]
  );
  return result.rows[0];
}
let books = [];

app.get("/", async (req, res) => {
  books = await getBooks();
  res.render("index.ejs", {
    books: books,
  });
});
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  const book = await getBook(id);
  res.render("notes.ejs", { book: book });
});

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port} port. `);
});
