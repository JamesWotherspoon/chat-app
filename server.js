const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
const Message = mongoose.model('Message', { name: String, message: String });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find({}).exec();
        res.send(messages);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/messages', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        io.emit('message', req.body);
        res.send('OK');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});

app.use(express.static(__dirname));

io.on('connection', () => {
    console.log('a user is connected');
});

const server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});
