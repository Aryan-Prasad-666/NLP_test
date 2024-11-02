const express = require('express');
const fs = require('fs');
const {NlpManager} = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const modelPath = './model.nlp';

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

if (fs.existsSync(modelPath)) {
    manager.load(modelPath);
    console.log('NLP model loaded');
} else {
    manager.addDocument('en', 'Hello', 'greeting');
    manager.addDocument('en', 'Hey', 'greeting');
    manager.addDocument('en', 'Hi', 'greeting');
    manager.addDocument('en', 'Good morning', 'greeting');
    manager.addDocument('en', 'sup', 'greeting');
    manager.addDocument('en', 'Good evening', 'greeting');
    manager.addDocument('en', 'Good afternoon', 'greeting');
    manager.addDocument('en', 'whatup dude', 'greeting');
    manager.addDocument('en', 'yo', 'greeting');
    manager.addAnswer('en', 'greeting', 'Hello! How can I help you today?');
    manager.addAnswer('en', 'greeting', 'Hi there! What can I do for you?');

    manager.addDocument('en', 'create a bill', 'bill.create');
    manager.addDocument('en', 'add an item', 'item.add');
    manager.addDocument('en', 'show my bills', 'bill.show');
    manager.addAnswer('en', 'bill.create', 'Sure! Let\'s create a new bill.');
    manager.addAnswer('en', 'item.add', 'Okay, tell me the item details.');
    manager.addAnswer('en', 'bill.show', 'Here are your bills:');

    (async () => {
        await manager.train();
        manager.save(modelPath);
        console.log('NLP model trained and saved');
    })();
}


app.get('/bot', async (req, res) => {
    const response = await manager.process('en', req.query.message);
    res.send(response.answer);
});


app.listen(port);