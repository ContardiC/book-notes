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


app.get("/", (req,res)=>{
    res.send("<h1>Welcome!</h1>");
});

app.listen(port, ()=>{
    console.log(`Server is running on  http://localhost:${port} port. `);
});