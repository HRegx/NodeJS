const express = require('express');
const _server = express();

const mysql = require('mysql');

const cors = require('cors')

_server.use(cors());
_server.use(express.json())

const  dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "puzzle"
})


_server.get('/tester',(req, res)=>{
    res.send("Your EC2 NodeJS is Running")
});

_server.get('/list',(req, res)=>{
    const sql = "SELECT * FROM top_score";

    dbConn.query(sql,(err, result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
        }
    })
})

_server.post("/create",(req, res)=>{
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

_server.listen(3001,()=>{
    console.log("Server Online");
});

