// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

app.post('/add', (req, res) => {
    const body = req.body;
    for (const key in body) {
        if (body.hasOwnProperty(key)) {
            projectData[key] = body[key];
        }
    }
    res.status(201);
    return res.json(projectData);
});

app.get('/data', (req, res) => {
    return res.json(projectData);
});

// Setup Server
const port = 3000;
app.listen(port, (req, res) => {
    console.log('Listening on localhost, port ' + port);
});