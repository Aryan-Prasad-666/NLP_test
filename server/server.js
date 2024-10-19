const express = require('express')
const app = express()
const port = 3000

require('dotenv').config();

const mysql = require('mysql2'); 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const connection = mysql.createConnection({
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,   
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE    
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

connection.query("select * from employee;", (err, result, fields)=>{
    if(err){
        return console.log(err);
    }
    return console.log(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})