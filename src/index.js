require('dotenv/config');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.send('Bem vindo ao chat online');
});

io.on('connection', (socket) => {
    console.log(`${socket.id} a user connected`);

    socket.on('disconnect', (reason) => {
        console.log(`${socket.id} disconnected: ${reason}`);
    });

    socket.on('set_username', (username) => {
       socket.data.username = username; 
    });

    socket.on('message', (message) => {
        io.emit('receive_message', {
            id: socket.id,
            username: socket.data.username,
            message,
            send_at: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        });
    });
});


server.listen({
    host: '0.0.0.0',
    port: process.env.PORT
}, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
