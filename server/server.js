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

const userContext = {};

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

//if model already exists then load the existing model else just train the model and save it.
if (fs.existsSync(modelPath)) {
    manager.load(modelPath);
    console.log('NLP model loaded');
} else {
    //model training
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


const createBill = async () => {
    const query = 'INSERT INTO bills (date) VALUES (CURDATE())';
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                console.error('Error creating bill:', err);
                return reject('Error creating bill.');
            }
            console.log('Bill created with ID:', result.insertId);
            resolve(result.insertId); // Return the new bill ID
        });
    });
};

const addItemToBill = async (billId, itemDetails) => {
    const query = 'INSERT INTO items (bill_id, name, price) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
        connection.query(query, [billId, itemDetails.name, itemDetails.price], (err, result) => {
            if (err) {
                console.error('Error adding item:', err);
                return reject('Error adding item.');
            }
            resolve(`Item added to bill ID ${billId}.`);
        });
    });
};

const showBills = async () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM bills';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching bills:', err);
                return reject('Error fetching bills.');
            }
            resolve(results);
        });
    });
};

// NLP processing endpoint
app.get('/bot', async (req, res) => {
    const userMessage = req.query.message;
    const userId = req.query.userId || 'default'; 

    if (userContext[userId]?.expecting === 'item_name') {
        userContext[userId].itemName = userMessage;
        userContext[userId].expecting = 'item_price';
        return res.send('What is the price of the item?');
    } else if (userContext[userId]?.expecting === 'item_price') {
        const itemPrice = parseFloat(userMessage);
        if (isNaN(itemPrice)) {
            return res.send("Please provide a valid price.");
        }

        const itemName = userContext[userId].itemName;
        const billId = userContext[userId].billId; // Get the current bill ID
        const responseMessage = await addItemToBill(billId, { name: itemName, price: itemPrice });

        userContext[userId].expecting = 'add_another'; 
        return res.send(`${responseMessage} Do you want to add another item?`);
    } else if (userContext[userId]?.expecting === 'add_another') {
        if (userMessage.toLowerCase() === 'yes') {
            userContext[userId].expecting = 'item_name';
            return res.send('What is the name of the next item you want to add?');
        } else {
            delete userContext[userId]; 
            return res.send('Alright, item addition completed.');
        }
    }

    const response = await manager.process('en', userMessage);

    if (response.intent === 'greeting') {
        res.send(response.answer);
    } else if (response.intent === 'bill.create') {
        const billId = await createBill();
        userContext[userId] = { billId, expecting: 'item_name' };
        res.send(`New bill created with ID ${billId}. Let's add items!`);
    } else if (response.intent === 'item.add') {
        userContext[userId] = { expecting: 'item_name' };
        res.send(response.answer);
    } else if (response.intent === 'bill.show') {
        const bills = await showBills();
        res.send(`Here are your bills: ${JSON.stringify(bills)}`);
    } else {
        res.send("I'm not sure how to respond to that.");
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});