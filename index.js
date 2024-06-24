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
    "SELECT b.id, b.title, a.fname, a.lname, n.review_text, n.rating , n.note FROM books b JOIN notes n on b.id = n.id_book JOIN authors a ON b.id_author = a.id WHERE b.id = $1;",
    [id]
  );
  return result.rows[0];
}

app.get("/", async (req, res) => {
  let books = [];
  books = await getBooks();
  res.render("index.ejs", {
    books: books,
  });
});
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const book = await getBook(id);
    console.log(JSON.stringify(book));
    res.render("notes.ejs", { book: book });
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore nel recupero del libro.");
  }
});
app.get("/new-author", (req,res)=>{
  res.render("new-author.ejs");
});
app.post("/add-author", async(req,res)=>{
  const fname = req.body.fname;
  const lname = req.body.lname;
  const biography = req.body.biography;
  try{
    const result = await db.query("INSERT INTO authors(fname,lname,biography) VALUES ($1,$2,$3) RETURNING *;",[fname,lname,biography]);
    const id = result.rows[0].id;
    res.redirect("/");
  }catch(err){
    console.error(err);
    res.status(500).send("Non e' possibile inserire questo autore. Probabilmente e' gia' presente");
  }
});

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port} port. `);
});
