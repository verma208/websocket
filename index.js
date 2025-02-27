// Import required modules
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Initialize the Express app
const app = express();
let messages = {}
let index = 0
// Create an HTTP server
const server = http.createServer(app);

// Initialize a WebSocket server on the same HTTP server
const wss = new WebSocket.Server({ server });
let clientStatus = "disconnected";
// Define a basic HTTP route
app.get('/', (req, res) => {
    let messageHTML = '';

    // Loop through the object
    for (let [key, value] of Object.entries(messages)) {
        messageHTML += `<p><strong>${key}:</strong> ${JSON.stringify(value)}</p>`;
    }
     res.send(`<div><h1>${clientStatus}</h1><p>${JSON.stringify(messageHTML)}</p></div>`);
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clientStatus = "connected";
    // Send a welcome message to the WebSocket client
    ws.send('Welcome to the WebSocket server!');

    // Handle incoming messages from the WebSocket client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Echo the message back to the client
        messages[index] = message
        index++
        ws.send(`Server received: ${message}`);
    });

    // Handle WebSocket client disconnection
    ws.on('close', () => {
        clientStatus = "disconnected";
        console.log('WebSocket client disconnected');
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Start the server
const PORT = 3005;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
