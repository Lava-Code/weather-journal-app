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
const { response } = require('express');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server

// define server port
const port = 7000;
// define the server, make express listen on port 7000 and create arrow function for listening
// const server = app.listen(port, function () { console.log(`The server is up and runing on port:${port}`)});
const server = app.listen(port, () => { console.log(`The server is up and runing on port:${port}`) });

// Routes for POST
app.post('/post', function(request, response){
    
    projectData.temp = request.body.temp;
    projectData.date = request.body.date;
    projectData.myFeeling = request.body.myFeeling;
    response.send(projectData)
    //console.log(projectData);
});

// Routes for GET
app.get('/get', function(request, response){
    response.send(projectData);
    console.log(projectData);
});