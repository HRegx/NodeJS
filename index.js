const express = require('express');
const _server = express();

const mysql = require('mysql');

const cors = require('cors')

_server.use(cors());
_server.use(express.json())

require("dotenv").config();

console.log(process.env.host);
// const  dbConn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "reviewthepast"
// })


const  dbConn = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})


_server.get("/tester",(req,res)=>{
    res.json("Your EC2 NodeJS is Running...");
})

_server.get('/highScore', (req,res)=>{
    const sql = "SELECT f_score FROM (SELECT f_score FROM top_score ORDER BY f_score ASC LIMIT 10) ptable  ORDER BY f_score DESC LIMIT 1";

    dbConn.query(sql,(err, result)=>{
        if(err){
            console.log(err);            
        } else {
            res.send(result);
        }
    })
})

_server.get('/handpick',(req, res)=>{
    const sql = "SELECT f_id, f_score, f_time, f_date, f_screen_name FROM top_score ORDER BY f_score ASC LIMIT 10";

    dbConn.query(sql,(err, result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
            console.log(result)
        }
    })
})



_server.post("/inject",(req, res)=>{
    const f_score = req.body.f_score;
    const f_time = req.body.f_time;
    const f_screen_name = req.body.f_screen_name;

    const sql = "INSERT INTO top_score (f_score,f_time,f_screen_name) VALUES (?)";
    const values = [
        f_score,
        f_time,
        f_screen_name
    ]

    dbConn.query(sql, [values], (err, data) => {
        if(err) {
            console.log(err)
        } else {
            res.send("Values Successfully Inserted");
        }
    });
})


// _server.post("/stocks",(req, res)=>{    
//     const dateFrom = req.body.dateFrom;
//     const dateTo = req.body.dateTo;
//     console.log(dateFrom +" :log from server: "+ dateTo)

//     const sql = "SELECT fieID, fieDate, fieClose FROM reviewthepast.tabspy WHERE fieDate >= ? AND fieDate <= ?";
        
//     dbConn.query(sql,[dateFrom,dateTo],(err, result)=>{
//     // dbConn.query(sql,['1991-01-01','2023-01-01'],(err, result)=>{
//         if(err){
//             console.log(err);
//         } else {
//             res.send(result)
//         }
//     })
// })


//Add field tempID and assign value from 1 to n
//SELECT (@row_number:=@row_number+1) as tempID, fieID FROM reviewthepast.tabspy, (SELECT @row_number:=0) AS t;


// SELECT tempID, fieID, fieDate, fieClose 
// FROM (
// 		SELECT (@row_number:=@row_number+1) as tempID, fieID, fieDate, fieClose 
// 		FROM reviewthepast.tabspy, (SELECT @row_number:=2-1) AS t  
// 		WHERE fieDate >= '1993-02-05' AND fieDate <= '1993-02-16'
// ) as child
// WHERE MOD(tempID, 2) = 0;


//This POST will Buy Stocks After "Every no. of trading day" with Selected Date Range.
_server.post("/stocks",(req, res)=>{    
    const dateFrom = req.body.dateFrom;
    const dateTo = req.body.dateTo;
    const n = req.body.noOfDays;
    console.log(dateFrom +" :log from server: "+ dateTo)

    const sql = "SELECT tempID, fieID, fieDate, fieClose \
    FROM ( \
            SELECT (@row_number:=@row_number+1) as tempID, fieID, fieDate, fieClose \
            FROM reviewthepast.tabspy, (SELECT @row_number:=?-1) AS t \
            WHERE fieDate >= ? AND fieDate <= ? \
    ) as child \
    WHERE MOD(tempID, ?) = 0";

    dbConn.query(sql,[n,dateFrom,dateTo,n],(err, result)=>{
    // dbConn.query(sql,['1991-01-01','2023-01-01'],(err, result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
        }
    })
})

app.post('/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // replace with your email address
        pass: 'your-password', // replace with your password
      },
    });

    await transporter.sendMail({
      from: email,
      to: 'recipient-email@gmail.com', // replace with your recipient email address
      subject,
      text: `From: ${name}\n\n${message}`,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


_server.listen(8080,()=>{
    console.log("AWS EC2 Server is now Online...");
});

