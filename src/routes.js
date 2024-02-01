// routes.js
const express = require('express');
const path = require('path');
const { Message } = require('./models.js');

function setupRoutes(app, io) {

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // Serve static files from the 'public' directory
    app.use('/public', express.static(path.join(__dirname, '../public')));


    // Render the index.ejs file
    app.get('/', (req, res) => {
        res.render('index');
    });

    // Your existing routes
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
        res.sendFile(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist', 'socket.io.js'));
    });

    io.on('connection', () => {
        console.log('a user is connected');
    });
}

module.exports = setupRoutes;
