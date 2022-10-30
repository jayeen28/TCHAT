const app = require('express')();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const { func } = require('./defaultValues');
const { room = func, message = func } = require('../entities');
const bridgeFunc = require('./bridge');
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', socket => {
    const bridge = bridgeFunc(socket);
    console.log('connected ', socket.id);
    socket.on('room', data => bridge.go(room, data, socket));
    socket.on('exit', data => bridge.go(room, data, socket))
    socket.on('message', data => bridge.go(message, data, socket));
    socket.on('disconnect', () => console.log('disconnected', socket.id));
});
module.exports = { server, io };