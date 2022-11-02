#! /usr/bin/env node

const { io } = require('socket.io-client');
const readline = require('readline').createInterface({ input: process.stdin });

class ChatEngine {
    constructor(readline, io) {
        this.readline = readline;
        this.io = io;
        this.stage = 'userName';
        this.userName = '';
        this.roomId = undefined;
        this.socket = undefined;
    }
    log(str) { process.stdout.write(str) }
    start() {
        this.socket = this.io(process.env.socketURL || 'http://localhost:5000');
        this.socket.on('connect', () => {
            console.log('Connected with server.');
            this.log('Enter your user name: ');
            this.readline.on('line', line => this.manageInput(line))
        });

        this.socket.on('room', data => {
            data = JSON.parse(data);
            this.roomId = data.roomId;
            this.stage = 'message';
            console.log(data.message || 'Error with room.');
            this.log('Message: ');
        });

        this.socket.on('message', data => {
            console.log(`\n ${data}`);
            this.log('Message: ');
        })
    }
    manageInput(line) {
        switch (this.stage) {
            case 'userName': this.manageUserName(line); break;
            case 'room': this.manageRoom(line); break;
            case 'message': this.manageMessage(line); break;
            default: this.manageUserName(line);
        }
    }
    manageUserName(input) {
        if (input.length < 1) {
            console.log('Invalid user name. Please type user name and hit enter.');
            return this.log('Enter your user name: ');
        }
        this.userName = input;
        this.stage = 'room';
        this.log(`Join or create room. \nType => join/create roomId and hit enter: `);
    }
    manageRoom(input) {
        try {
            const parts = input.split(" ");
            if (parts.length < 2 || (parts[0] !== 'join' && parts[0] !== 'create')) {
                return console.log('Invalid input');
            }
            this.socket.emit('room', JSON.stringify({ roomId: parts[1], action: parts[0] }));
        }
        catch (e) { console.log(e) }
    };
    manageMessage(message) {
        message = message + ' - ' + this.userName;
        this.socket.emit('message', JSON.stringify({ roomId: this.roomId, message }));
    }
};

const chat = new ChatEngine(readline, io);
chat.start();