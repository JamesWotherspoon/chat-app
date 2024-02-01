// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const ejs = require('ejs');

const routes = require('./routes');

const connectionString = 'mongodb://localhost:27017/chat-app';

async function dbConnect() {
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app, io);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
