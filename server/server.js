const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./util/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected')
    socket.emit('newMessage', generateMessage('Admin', 'Welcome!'));
    socket.broadcast.emit('newMessage', generateMessage('System', 'New user Joined!'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('this is from server');
    });

    socket.on('createLocationMessage', (coords)=> {
        io.emit('newLocationMessage', generateLocationMessage('lupard',coords.lat,coords.lng));
    })

    socket.on('disconnect', () => {
        console.log('user disconnected from server');
    });
});

server.listen(port, ()=>{
    console.log(`server running on ${port}`)
});