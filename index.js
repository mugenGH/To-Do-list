import express from "express";
import bodyParser from "body-parser";
import randomQuotes from "random-quotes";
import path from 'path';  // Import path module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));


const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "123456",
  port: 5432,
});
db.connect();



app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const day=new Date().getDay();
const month = new Date().getMonth();
let tasks=[];

async function getList() {
  const result= await db.query("SELECT * FROM tasks order by id desc");
  tasks= result.rows;
}
  app.get("/",async (req,res)=>{
   await getList();
 const quotes=randomQuotes.default();
    res.render("index",{
      quote: quotes["body"] ,
      author:quotes["author"],
      task: tasks,
        day:allDay[day],
        month : allMonth[month]
    });
  }); 
app.post("/submit",async(req,res)=>{ 
 

 const task =req.body["input"];
await db.query("INSERT INTO tasks (title) VALUES ($1)",[task]);
res.redirect("/");
});

app.post("/delete",async(req,res)=>{
 
   const id=req.body.itemId;


await db.query("DELETE from tasks where id=$1",[id]);
   res.redirect("/");
  
});
app.listen(port, () => {
 
    console.log(`Listening on port ${port}`);
  }); 

  const allDay= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const allMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];