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

    //greetings
    manager.addDocument('en', 'Hello', 'greeting');
    manager.addDocument('en', 'Hey', 'greeting');
    manager.addDocument('en', 'Hi', 'greeting');
    manager.addDocument('en', 'Good morning', 'greeting');
    manager.addDocument('en', 'How are you?', 'greeting');
    manager.addDocument('en', 'What\'s up?', 'greeting');
    manager.addDocument('en', 'Is anyone there?', 'greeting');
    manager.addDocument('en', 'Hi, is this conversoDB?', 'greeting');
    manager.addAnswer('en', 'greeting', 'I\'m here to assist you. How can I help?');
    manager.addAnswer('en', 'greeting', 'Hello! Ready to assist your business needs.');
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
    manager.addDocument('en', 'Create a bill', 'bill.create');
manager.addDocument('en', 'Generate a bill', 'bill.create');
manager.addDocument('en', 'Make a new bill', 'bill.create');
manager.addAnswer('en', 'bill.create', 'Sure! Let\'s create a new bill. Please provide the details.');

manager.addDocument('en', 'Show all bills', 'bill.show');
manager.addDocument('en', 'List my bills', 'bill.show');
manager.addDocument('en', 'View my bills', 'bill.show');
manager.addAnswer('en', 'bill.show', 'Here are your current bills: [display bills].');

manager.addDocument('en', 'Delete a bill', 'bill.delete');
manager.addDocument('en', 'Remove a bill', 'bill.delete');
manager.addAnswer('en', 'bill.delete', 'Which bill would you like to delete?');

manager.addDocument('en', 'Update a bill', 'bill.update');
manager.addDocument('en', 'Edit a bill', 'bill.update');
manager.addAnswer('en', 'bill.update', 'Tell me what you\'d like to update in the bill.');

    manager.addAnswer('en', 'bill.create', 'Sure! Let\'s create a new bill.');
    manager.addAnswer('en', 'item.add', 'Okay, tell me the item details.');
    manager.addAnswer('en', 'bill.show', 'Here are your bills:');

//inventory management
    manager.addDocument('en', 'Add an item', 'item.add');
manager.addDocument('en', 'Add a product', 'item.add');
manager.addDocument('en', 'Create a new item', 'item.add');
manager.addAnswer('en', 'item.add', 'Sure, please provide the item details.');

manager.addDocument('en', 'Show all items', 'item.show');
manager.addDocument('en', 'List all items', 'item.show');
manager.addDocument('en', 'View my items', 'item.show');
manager.addAnswer('en', 'item.show', 'Here are your current items: [display items].');

manager.addDocument('en', 'Update item details', 'item.update');
manager.addDocument('en', 'Edit an item', 'item.update');
manager.addAnswer('en', 'item.update', 'Which item would you like to update?');

manager.addDocument('en', 'Delete an item', 'item.delete');
manager.addDocument('en', 'Remove an item', 'item.delete');
manager.addAnswer('en', 'item.delete', 'Sure, which item would you like to delete?');

//customer managemnet

manager.addDocument('en', 'Add a customer', 'customer.add');
manager.addDocument('en', 'Create a new customer', 'customer.add');
manager.addAnswer('en', 'customer.add', 'Please provide the customer details.');

manager.addDocument('en', 'Show all customers', 'customer.show');
manager.addDocument('en', 'List my customers', 'customer.show');
manager.addAnswer('en', 'customer.show', 'Here are your current customers: [display customers].');

manager.addDocument('en', 'Update customer details', 'customer.update');
manager.addDocument('en', 'Edit a customer', 'customer.update');
manager.addAnswer('en', 'customer.update', 'Which customer would you like to update?');

manager.addDocument('en', 'Delete a customer', 'customer.delete');
manager.addDocument('en', 'Remove a customer', 'customer.delete');
manager.addAnswer('en', 'customer.delete', 'Which customer would you like to delete?');

//reporting and analytics
manager.addDocument('en', 'Show sales report', 'report.sales');
manager.addDocument('en', 'Generate a sales report', 'report.sales');
manager.addAnswer('en', 'report.sales', 'Here is your sales report: [display report].');

manager.addDocument('en', 'Show inventory report', 'report.inventory');
manager.addDocument('en', 'Generate an inventory report', 'report.inventory');
manager.addAnswer('en', 'report.inventory', 'Here is your inventory report: [display report].');

manager.addDocument('en', 'Show customer trends', 'report.customer');
manager.addDocument('en', 'Generate customer trend analysis', 'report.customer');
manager.addAnswer('en', 'report.customer', 'Here is the customer trend analysis: [display trends].');


//general

manager.addDocument('en', 'What can you do?', 'help');
manager.addDocument('en', 'How can you help me?', 'help');
manager.addDocument('en', 'Show me the commands', 'help');
manager.addAnswer('en', 'help', 'I can help you manage your database by creating bills, adding items, managing customers, and generating reports.');

manager.addDocument('en', 'I need help', 'help');
manager.addDocument('en', 'Can you assist me?', 'help');
manager.addAnswer('en', 'help', 'Sure! What do you need help with?');




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