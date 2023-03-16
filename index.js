const express = require('express');
const _server = express();

const mysql = require('mysql');

const cors = require('cors')

_server.use(cors());
_server.use(express.json())

require("dotenv").config();

console.log(process.env.host);
const  dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "reviewthepast"
})


// const  dbConn = mysql.createConnection({
//     host: process.env.host,
//     user: process.env.user,
//     password: process.env.password,
//     database: process.env.database
// })


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
    console.log("create");

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


_server.get('/stocks',(req, res)=>{
    
    const dateFrom = req.body.dateFrom;
    const dateTo = req.body.dateTo;
    console.log(dateFrom +"::"+dateTo)

    const sql = "SELECT fieID, fieDate, fieClose FROM reviewthepast.tabspy WHERE fieDate >= ? AND fieDate <= ?";
        
    dbConn.query(sql,[dateFrom,dateTo],(err, result)=>{
    // dbConn.query(sql,['1991-01-01','2023-01-01'],(err, result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
            console.log(result)
        }
    })
})


_server.post('/stocks',(req, res)=>{
    
    const dateFrom = req.body.dateFrom;
    const dateTo = req.body.dateTo;
    console.log(dateFrom +"::"+dateTo)

    const sql = "SELECT fieID, fieDate, fieClose FROM reviewthepast.tabspy WHERE fieDate >= ? AND fieDate <= ?";
        
    dbConn.query(sql,[dateFrom,dateTo],(err, result)=>{
    // dbConn.query(sql,['1991-01-01','2023-01-01'],(err, result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
            console.log(result)
        }
    })
})

_server.listen(8080,()=>{
    console.log("AWS EC2 Server is now Online...");
});

