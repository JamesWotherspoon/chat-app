// Import necessary modules
const $ = require('jquery');
const io = require('socket.io-client');

// Document ready event handler
$(document).ready(() => {
    // Click event handler for the "Send" button
    $("#send").click(() => {
        sendMessage({
            name: $("#name").val(),
            message: $("#message").val()
        });
    });

    // Fetch and display existing messages
    getMessages();

    // Initialize socket connection
    const socket = io('http://localhost:3000');

    // Listen for incoming messages from the server
    socket.on('message', addMessages);
});

// Function to add messages to the DOM
function addMessages(message) {
    $('#messages').append(`
        <h4>${message.name}</h4>
        <p>${message.message}</p>
    `);
}

// Function to fetch messages from the server
function getMessages() {
    $.get('/messages', (data) => {
        data.forEach(addMessages);
    });
}

// Function to send a new message to the server
function sendMessage(message) {
    if (message.name && message.message) {
        $.post('/messages', message);
    } else {
        alert('Name and message cannot be empty.');
    }
}
