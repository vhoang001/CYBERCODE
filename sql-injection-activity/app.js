const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Create a new SQLite database
const db = new sqlite3.Database(':memory:');

// Create the users table and insert a user
db.serialize(() => {
    db.run("CREATE TABLE user (username TEXT, password TEXT)");
    const stmt = db.prepare("INSERT INTO user VALUES (?, ?)");
    stmt.run("user1", "password1");
    stmt.finalize();
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT username FROM user WHERE username = '${username}' AND password = '${password}'`;
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`SQL Query: ${query}`);

    db.get(query, (err, row) => {
        if (err) {
            console.error(err);
            res.send('Error processing request');
            return;
        }
        if (row) {
            res.send('Login successful');
        } else {
            res.send('Invalid username or password');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
