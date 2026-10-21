window.addEventListener('load', () => {
  console.log("Client side app.js has successfully loaded!");

  // Get all the thoughts from the database
  getThoughtsData();
});

// Global Variables
let thoughtsData = [];
let submitThoughtButton = document.getElementById('submitThoughtButton');
let feed = document.getElementById('feed');
let topicInput = document.getElementById('topicDropdown');
let thoughtInput = document.getElementById('thoughtInput')

// Get all the thoughts from the database
async function getThoughtsData() {
  try {
    console.log("Attempting to get all the thought data from the server:");
    // Fetch all the thoughts from the database
    let thoughtsResponse = await fetch('/thoughts');

    // Convert the response into json
    let serverData = await thoughtsResponse.json();
    // Extract the thooughts array from the incoming database object container
    thoughtsData = serverData.thoughts; 

    console.log("All thoughts from the database have been received:");
    console.log(thoughtsData);

    // Display the thoughts data from the database onto the page's HTML
    console.log("Displaying all the thoughts received from the database now.");
    displayThoughtsData();
    
  } catch (error) {
    console.log("Something went wrong while trying to get thoughts data from the database:");
    console.log(`error: ${error}`);
  }
}

// Display the thoughts data from the database onto the page's HTML
// TODO: edit what gets seen on page and how!!!
function displayThoughtsData() {
  // Select for element on the page
  let feed = document.getElementById('feed');
  // Loop through data and append to the page
  for (let i = 0; i < thoughtsData.length; i++){
    let currentTopic = thoughtsData[i].topic;
    let currentThought = thoughtsData[i].thought;

    let currentEl = document.createElement('p');
    currentEl.innerHTML = currentTopic + " - " + currentThought;

    feed.appendChild(currentEl);
  }
}

// Submit thought button event listener to collect thought data from the form and POST it to the server
submitThoughtButton.addEventListener('click', () => {
  console.log("Submit thought data button was clicked!");

  // Get the topic that the user selected from the dropdown in the form
  let currentTopic = topicInput.value;

  // Get the thought that the user wrote in the text input field in the form
  let currentThought = thoughtInput.value;

  // Format form inputs into an object
  let thoughtObject = {
    topic: currentTopic,
    thought: currentThought
  };
  console.log("Thought object created from form:");
  console.log(thoughtObject);

  // Convert this thought object into JSON:
  let thoughtObjectJSON = JSON.stringify(thoughtObject);
  console.log("Thought object json created from form:");
  console.log(thoughtObjectJSON);

  // Send user data from form to the server
  sendThoughtDataToServer(thoughtObjectJSON, currentTopic, currentThought);
});

// Send given JSON data to the server
async function sendThoughtDataToServer(thoughtObjectJSONData, topic, thought) {
  try {
    console.log("Attempting to send thought data to the server:");

    // Create a POST fetch response to send to the server
    let newThoughtResponse = await fetch("/newThought", {
      method: "POST",
      headers: {"content-Type": "application/json"},
      body: thoughtObjectJSONData
    });

    // Convert the response into JSON
    let newThoughtData = await newThoughtResponse.json();
    console.log("New thought data has been sent yay!");
    console.log(newThoughtData);

    // Update the HTML of the page to display the new thought that the user entered in the form and to clear the form
    showNewThought(topic, thought);
  } catch (error) {
    console.log("Something went wrong while trying to send user's thought data from the form to the database:");
    console.log(`error: ${error}`);
  }
}

// Show the given new thought data in the feed and clear the form
function showNewThought(newTopic, newThought) {
  // Make a paragraph element
  let currentEl = document.createElement('p');
  currentEl.innerHTML = newTopic + " - " + newThought;

  // Attach this paragraph element to the feed
  feed.appendChild(currentEl);

  // topicInput.value = ''
  // Clear the thought that the user wrote in the form text input
  thoughtInput.value = '';
}