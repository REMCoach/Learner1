const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const bodyParser = require("body-parser");
 const fileUpload = require('express-fileupload');
//var fs = require("fs");
var path = require('path');
//const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();
// Initialize server

app.use(express.static('Files'));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
 app.use(cors());
  
 const { json } = require("body-parser");
// Database connection

const {
    DB_HOST,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_TIMEZONE
  } = require("../src/config");

  
  let db_config = {
    
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    timezone: DB_TIMEZONE,
  
  };


//db connection

var db =mysql.createConnection(db_config);

db.connect()
//console.log(db);
db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });


app.post('/bsreport',(req,res)=>{
  var bname = req.body.bname;
  var tname = req.body.tabname;
  var date = req.body.date;
  var ip = req.body.ip;
  var user = req.body.user;
  var type = req.body.type;

  var qu = "insert into bsreport (bname,tabname,date,ip,user,type) values (?,?,?,?,?,?)";
  db.query(qu,[bname,tname,date,ip,user,type],(err,result)=>{
    if(err){console.log(err)}
  })
  
})

app.post('/bsdate',(req,res)=>{
  var from = req.body.from
  var to = req.body.to
  
  //console.log(req.body);
  db.query("SELECT * FROM bsreport WHERE  date >= ? AND date <= ?",[from,to],(err,result)=>{
    if(!err){
    //console.log(result);
      res.send(result)
    }else{err}
  })
})

app.post('/clickadd',(req,res)=>{
  var bname = req.body.bname;
  var tname = req.body.tabname;
  var date = req.body.date; 
  var ip = req.body.ip;
  var user = req.body.user;
  var type = req.body.type;

  var qu = "insert into click (bname,tabname,date,ip,user,type) values (?,?,?,?,?,?)";
  db.query(qu,[bname,tname,date,ip,user,type],(err,result)=>{
    if(err){console.log(err)}
  })
  
})
app.post('/click',(req,res)=>{
  var from = req.body.from
  var to = req.body.to
  
  //console.log(req.body);
  db.query("SELECT * FROM click WHERE  date >= ? AND date <= ?",[from,to],(err,result)=>{
    if(!err){
    //console.log(result);
      res.send(result)
    }else{err}
  })
})

app.get('/usernamecheck',(req,res)=>{
  console.log("Calluser");
    var query = 'select user from task4user  '
    db.query(query,(err,re)=>{
      if(!err){res.send(re);}
     // console.log(re)
    })
  })
  
app.post("/admin",(req,res)=>{

    console.log("calling login");
    var email= req.body.email;
    var password = req.body.password;
    console.log(email);
    db.query('SELECT * FROM admin WHERE username = (?)',[email], async function (error, results, fields) {
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        if(results.length >0){
          
          console.log(password === results[0].password);
          if(password === results[0].password){
              res.send({
                "code":200,
                "success":"login sucessfull",
                "data1" :results[0]
              }
              )
          }
          else{
            
            res.send({
                 "code":204,
                 "success":"Email and password does not match",
                 
            })
          }
        }
        else{
          res.send({
            "code":206,
            "success":"Email does not exits"
              });
        }
      }
      });
    
  });
  
app.post('/submittask4',(req,res)=>{
  var uname = req.body.user
  var pass = req.body.pass
  var dob = req.body.dob
  var location = req.body.location
  var religion = req.body.religion
  
  let dvb =" INSERT INTO `task4user` (`user`, `pass`, `dob`, `religion`, `location`) VALUES (?,?,?,?,?); "
  db.query(dvb,[uname,pass,dob,religion,location],(err,result)=>{
    
    if(!err){res.send({"code":"200"})}
    else{res.send({"code":"400"})}
  })
})

app.post('/uploadfile', (req, res) => {
 //console.log(req.files);
    console.log("call");
    if (!req.files) {  
      console.log("file not found")
        return res.status(500).send({ msg: "file is not found" })
      
    }
        // accessing the file
    const myFile = req.files.file;
  //  console.log(myFile);
    // mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err,result) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name

        
        return res.send({name: myFile.name, 
          path: `http://localhost:4000/public/${myFile.name}`});

          
    });
})

app.post('/bannerupload',(req,res)=>{
  let age = req.body.age
  let city  = req.body.city
  let religion  = req.body.religion
  let url = req.body.url
  

  if(age=="18+"){
    if(city=="Chennai"){
        if(religion=="Religion1"){
          console.log("type1")
          db.query("insert into task4 (type1) values(?)",[url],(err,result)=>{
            if(!err){res.send({"type":"type1"})}
            else{res.send("error"),
          console.log(err);}
          })
        }else{
          console.log("type2")
          db.query("insert into task4 (type2) values (?)",[url],(err,result)=>{
            if(!err){res.send({"type":"type2"})}
            else{res.send("error")}
          })
        }
    }else{
      if(religion=="Religion1"){
        console.log("type3")
        db.query("insert into task4 (type3) values (?)",[url],(err,result)=>{
          if(!err){res.send({"type":"type3"})}
          else{res.send("error")}
        })
      }else{
        console.log("type4")
        db.query("insert into task4 (type4) values (?)",[url],(err,result)=>{
          if(!err){res.send({"type":"type4"})}
          else{res.send("error")}
        })
      }
    }

  }else{
    if(city=="Chennai"){
      if(religion=="Religion1"){
        console.log("type5")
        db.query("insert into task4 (type5) values (?)",[url],(err,result)=>{
          if(!err){res.send({"type":"type5"})}
          else{res.send("error")}
        })
      }else{
        console.log("type6")
        db.query("insert into task4 (type6) values (?)",[url],(err,result)=>{
          if(!err){res.send({"type":"type6"})}
          else{res.send("error")}
        })
      }
  }else{
    if(religion=="Religion1"){
      console.log("type7")
      db.query("insert into task4 (type7) values (?)",[url],(err,result)=>{
        if(!err){res.send({"type":"type7"})}
        else{res.send("error")}
      })
    }else{
      console.log("type8")
      db.query("insert into task4 (type8) values (?)",[url],(err,result)=>{
        if(!err){res.send({"type":"type8"})}
        else{res.send("error")}
      })
    }
  }


  }


})

app.post("/userlogin",(req,res)=>{

  console.log("calling login");
  var email= req.body.email;
  var password = req.body.password;
  console.log(email);
  db.query('SELECT * FROM task4user WHERE user = (?)',[email], async function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        // console.log(password);
        // console.log( results[0].password);
        // const comparision = await bcrypt.compare(password, results[0].password);
     // console.log(results[0].crop);
        console.log(password === results[0].pass);

        if(password === results[0].pass){
            res.send({
              "code":200,
              "success":"login sucessfull",
            "results": results[0]
            }
            )
        }
        else{
          
          res.send({
               "code":204,
               "success":"Email and password does not match",
               
          })
        }
      }
      else{
        res.send({
          "code":206,
          "success":"Email does not exits"
            });
      }
    }
    });
  
});

app.get('/banner',(req,res)=>{
  db.query("select * from task4",(err,result)=>{
    if(!err){res.send(result)}
    else{console.log(err)}
  })
})
// __dirname will use the current path from where you run this file 
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/public')));


module.exports = app;
