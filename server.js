const express = require("express");
// import express from "express"
import mysql from "mysql"
const _server  = express();

// const cors = require("cors"); //we need to install cors
// _server.use(cors());


//Note:
//the database should be close each time
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'passwordhere';
const  dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "puzzle"
})

_server.get("/",(req,res)=>{
    res.json("Hello World from Server");
})

_server.get("/get",(req,res)=>{
    console.log("SELECT");
    const sql = "SELECT f_screen_name from top_score limit 200"
    dbConn.query(sql,(err,data)=>{
        if(err){
            return res.json(err);
        } else {
            return res.json(data);
        }
    });
});

_server.post("/test",(req, res)=>{
    console.log(res.body);
})

_server.all("/add",(req, res)=>{
    console.log("INSERT");
    const sql = "INSERT INTO top_score (f_score,f_time,f_screen_name) VALUES (?)";
    const values = [
        "100",
        "00:01:00",
        "regin"
    ]

    dbConn.query(sql, [values], (err, data) => {
        if(err) return res.json(err);
        return res.send(data);
    });
})

_server.listen(8800, ()=> {
    console.log("Server Online");
});
