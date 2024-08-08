import express from "express";
import bodyParser from "body-parser";
import randomQuotes from "random-quotes";
import path from 'path';  // Import path module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));


const port = 3000;
const db = new pg.Client({
  user: 'todolist_spm6_user',
  host: 'dpg-cqq4drogph6c73848lo0-a.oregon-postgres.render.com',
  database: 'todolist_spm6',
  password: 'YC11pweo54qDIt7XSsDwvyT724Pb0PCv',
  port: 5432,
});
db.connect();

let currentUser=1;
let currentUserName='Null'

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const day=new Date().getDay();
const month = new Date().getMonth();
let tasks=[]

async function getList() {
  const result= await db.query("SELECT * FROM tasks  WHERE user_id=$1 order by id desc",[currentUser]);
  tasks= result.rows;
}
async function getName() {
  const result= await db.query("SELECT * FROM users where id=$1 ",[currentUser]);
  currentUserName=result.rows[0].name;
}
  app.get("/",async (req,res)=>{
   await getList();
   await getName();
 const quotes=randomQuotes.default();
    res.render("index",{
      quote: quotes["body"] ,
      author:quotes["author"],
      task: tasks,
      name:currentUserName,
        day:allDay[day],
        month : allMonth[month]
    });
  }); 
app.post("/submit",async(req,res)=>{ 
 const task =req.body["input"];
await db.query("INSERT INTO tasks (title,user_id) VALUES ($1,$2)",[task,currentUser]);
res.redirect("/");
});

app.post("/delete",async(req,res)=>{
 
   const id=req.body.itemId;
await db.query("DELETE from tasks where id=$1",[id]);
   res.redirect("/");
  
});

app.post("/addUser", async (req,res)=>{
  try{
  const userName=req.body.userName;
  currentUserName=userName;
  const id= await db.query("INSERT INTO users (name) VALUES ($1) returning id ",[userName]);
  currentUser=id.rows[0].id;
  res.redirect("/");}catch(error){
    res.render("newUser",{error:"user already exist"});
  }
})
app.post("/getUser", async (req,res)=>{
try{
  const userName=req.body.userName;
  const id = await db.query("SELECT id  from users where name=$1",[userName]);
  currentUser=id.rows[0].id;
  res.redirect("/");}
  catch(error){
    const quotes=randomQuotes.default();
    res.render("index",{
      quote: quotes["body"] ,
      author:quotes["author"],
      task: tasks,
      name:currentUserName,
        day:allDay[day],
        month : allMonth[month],
        error:"user doesn't exist"
    });
  }
})

app.get("/newUser",(req,res)=>{
  res.render("newUser");
})

app.listen(port, () => {
 
    console.log(`Listening on port ${port}`);
  }); 

  const allDay= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const allMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];