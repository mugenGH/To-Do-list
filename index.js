import express from "express";
import bodyParser from "body-parser";
import randomQuotes from "random-quotes";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const day=new Date().getDay();
const month = new Date().getMonth();
const tasks=[];

  app.get("/",(req,res)=>{
   
 const quotes=randomQuotes.default();
    res.render("index.ejs",{
      quote: quotes["body"] ,
      author:quotes["author"],
      task: tasks,
        day:allDay[day],
        month : allMonth[month]
    });
  }); 
app.post("/submit",(req,res)=>{ 
 

  tasks[tasks.length]=req.body["input"];
res.redirect("/");
});

app.post("/delete",(req,res)=>{
 
   const index=tasks.indexOf(req.body.item);
   tasks.splice(index,1);

   res.redirect("/");
  
});
app.listen(port, () => {
 
    console.log(`Listening on port ${port}`);
  }); 

  const allDay= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const allMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];