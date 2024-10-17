const express = require('express')
const app = express()
const port = 3000

const mysql = require('mysql2'); 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const connection = mysql.createConnection({
    host: 'localhost',      
    user: 'root',   
    password: '9380088115', 
    database: 'aryan'  
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