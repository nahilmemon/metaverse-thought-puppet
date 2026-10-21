// Starting thought data array
// let thoughtData = [
//   {
//     topic: "dreams",
//     thought: "sandcastle"
//   },
//   {
//     topic: "woes",
//     thought: "failure"
//   }
// ];

// Import LowDB
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Set up the server
import express from 'express';
let app = express();

// Initialize the LowDB database
const thoughtData = { thoughts: [] };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, thoughtData);

// Add json parse middleware so the server can properly parse json data
app.use(express.json()); 

// Serve static files from a public folder
app.use(express.static('public'));

// Set port variable to listen for requests
let port = 3000;
app.listen(port, () => {
  console.log('Server listening on localhost:', port);
});

/* ==== ROUTES ==== */
// Display data from the database on the server
app.get('/thoughts', (request, response) => {
  // Read all the thoughts data from the database
  db.read()
    .then(() => {
      // Save the thought data received from the database to an object
      let receivedThoughtsData = {thoughts : db.data.thoughts};

      // Send the thought data received from the database to the client
      response.json(receivedThoughtsData);
    });
});

// Route for when the client wants to submit a new thought to the database
app.post('/newThought', (request, response) => {
  try {
    console.log("Server has received a request from the user to send a new thought to the database");

    // Make a new thought object based on the contents of the client request's body
    let newThought = request.body;
    // Add a timestamp to this object
    newThought.time = Date();

    // // Store the new thought data in the existing thought data array
    // thoughtData.push(newThought);

    // Write the new thought data into the database
    db.data.thoughts.push(newThought);
    db.write()
      .then(() => {
        // Send a response object back to the client with a “success” message
        response.json({
          'message': 'Success!! Yay!'
        });
      });
    
  } catch(error) {
    console.log("Something went wrong while trying to update the database with the new thought data the user had posted:");
    console.log(`error: ${error}`);
  }
});