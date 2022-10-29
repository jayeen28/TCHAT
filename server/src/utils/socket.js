const app = require('express')();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const { room = emptyFunc(), message = emptyFunc() } = require('../entities');
const { emptyFunc } = require('./defaultValues');
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', socket => {
    console.log('Connected ', socket.id);
    socket.on('enter', data => room(data, socket));
    socket.on('message', data => message(data, socket, io));
    socket.on('disconnect', () => console.log('Disconnected', socket.id));
});
module.exports = { server, io };