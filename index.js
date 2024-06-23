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

async function getBooks() {
  const result = await db.query(
    "SELECT b.title, a.fname, a.lname, n.review_text, n.rating  FROM books b JOIN notes n ON b.id = n.id_book JOIN authors a ON b.id_author = a.id"
  );
  return result.rows;
}
let books = [];

app.get("/", async (req, res) => {
  books = await getBooks();
  console.log(JSON.stringify(books));
  res.render("index.ejs",{
    books: books,
  });
});

app.get("");
app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port} port. `);
});
