const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Dummy data storage
let dataStore = {};

app.use(bodyParser.json());


// Function to generate a random letter
function getRandomLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

// Function to generate a key with a specific format
function generateKey() {
    let key = '';
    for (let i = 0; i < 30; i++) {
        if (i > 0 && i % 10 === 0) {
            key += '-';
        } else {
            key += getRandomLetter();
        }
    }
    return key;
}



// Endpoint to add or update data for a specific ID
app.post('/key/create', (req, res) => {
    const id = generateKey()
    const data = req.body;

    dataStore[id] = data;
    res.json({ 
        message: `Key successfully generated!`,
        key: id
    });
});

// Endpoint to get data for a specific ID
app.get('/key/data/:id', (req, res) => {
    const id = req.params.id;

    if (id in dataStore) {
        res.json(dataStore[id]);
    } else {
        res.status(404).json({
             message: 'Key not found.',
             key: id
            });
    }
});

// Endpoint to get a list of all IDs
app.get('/key/list', (req, res) => {
    res.json(Object.keys(dataStore));
});

app.get('/key/check/:id', (req, res) => {
    const id = req.params.id;

    if (id in dataStore) {
        res.status(200).json({ exists: true });
    } else {
        res.status(404).json({ exists: false });
    }
});

app.delete('/key/delete/:id', (req, res) => {
    const id = req.params.id;

    if (id in dataStore) {
        delete dataStore[id];
        res.json({
             message: `Successfully key delete!`,
             key: id
             });
    } else {
        res.status(404).json({ message: 'ID not found.' });
    }
});

app.post('/key/reset', (req, res) => {
    dataStore = {}; // Clear the dataStore object
    res.json({ message: 'Data reset successful.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
