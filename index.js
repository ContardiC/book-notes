import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import flash from "connect-flash";

//TODO: add  Open Library Covers API 
// Axios request


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
    books: books, query: req.query
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
    res.redirect("/?message=L'autore è stato inserito con successo!&type=success");
  }catch(err){
    console.error(err);
    res.redirect("/?message=Non e' stato possibile inserire l'autore.&type=error");
  }
});
async function getAuthors(){
  try{
    const result = await db.query("SELECT * FROM authors ORDER BY lname ASC;");
    return result.rows;
  }catch(err){
    console.error(err);
    res.staus(500).send("Non e' stato possibile recuperare gli autori.");
  }
}

async function getCategories(){
  try{
    const result = await db.query("SELECT * FROM categories ORDER BY name ASC ");
    return result.rows;
  }catch(err){
    console.error(err);
    res.staus(500).send("Non e' stato possibile recuperare le categorie.");
  }
}

async function getNewBooks(){
  try{
    const result = await db.query("SELECT * FROM books WHERE id NOT IN (SELECT id_book FROM notes);");
    return result.rows;
  }catch(err){
    console.error(err);
  }
}

app.get("/new-book", async (req,res)=>{
  let authors = await getAuthors();
  let categories = await getCategories();
  res.render("new-book.ejs", {authors: authors, categories: categories});
});

app.post("/add-book", async(req,res)=>{
  const title = req.body.title;
  const isbn = req.body.isbn;
  const id_author = req.body.id_author;
  const id_category = req.body.id_category;
  const summary = req.body.summary;
  const reading_date= req.body.reading_date;
  console.log(id_author);
  console.log(id_category);
  console.log(reading_date);
  try{
    await db.query("INSERT INTO books(title,id_author,id_category,isbn,summary,reading_date) VALUES($1,$2,$3,$4,$5,$6);",[title,id_author,id_category,isbn,summary,reading_date]);
    res.redirect("/?message=Il libro è stato inserito con successo!&type=success");

  }catch(err){
    console.error(err);
    res.redirect("/?message=Non e' stato possibile inserire il libro.&type=error");

  }
});

app.post("/update-note", async (req,res)=>{
  const id = req.body.id;
  const note = req.body.note;
  try{
    await db.query("UPDATE notes SET note =$1 WHERE id_book = $2;",[note,id]);
    res.redirect("/?message=La nota e' stata aggiornata con successo!&type=success");
  }catch(err){
    console.error(err);
    res.redirect("/?message=Non e' stato possibile aggiornare la nota.&type=error");
  }
});
app.get("/new-note",async(req,res)=>{
  let books = [];
  let categories = [];
  let authors = [];
  books = await getNewBooks();
  authors = await getAuthors();
  categories = await getCategories();
  res.render("new-note.ejs", {books: books, authors: authors, categories: categories});
});

app.post("/add-note", async (req,res)=>{
  const id_book = req.body.id_book;
  const review_text = req.body.review_text;
  const note = req.body.note;
  const rating = req.body.rating;
  //console.log(`id: ${id_book} reading_text: ${reading_text} note: ${note} rating: ${rating}`);
  try{
    await db.query("INSERT INTO notes(id_book, review_text, rating, note) VALUES($1,$2,$3,$4);",[id_book,review_text,rating,note]);
    res.redirect("/?message=La nota e' stata aggiuntacon successo!&type=success");

  }catch(err){
    console.log(err);
    res.redirect("/?message=Non e' stato possibile aggiungere la nota.&type=error");

  }


});


app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port} port. `);
});
