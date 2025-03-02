const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Create an Express application
const app = express();

// Serve a static file for demonstration (optional)
app.get('/', (req, res) => {
    res.send('WebSocket server is running!');
});

// Create an HTTP server
const server = http.createServer(app);

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });


let ecgList = []
const ecgIDs = new Set();
let ecgDetails = []



let deviceList = []
const deviceIDs = new Set();
let deviceDetails = []



// Broadcast a message to all connected clients
const broadcast = (data, devices) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send("bryh");
            console.log(data);
            client.send(data);
        }
    });
};




// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');




    // Handle incoming messages
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        if (!ecgIDs.has(message["id"])) {
            ecgList.push(ws);
            ecgDetails.push(message);
            ecgIDs.add(message["id"]);
        }

        if (!deviceIDs.has(message["id"])) {
            deviceList.push(ws);
            deviceDetails.push(message);
            deviceIDs.add(message["id"]);
        }

        else{
            broadcast(String(message), deviceList);
        }
    });



    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.port | 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
