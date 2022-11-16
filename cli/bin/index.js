#! /usr/bin/env node

const { io } = require('socket.io-client');
const util = require('util');
const prompt = require('prompt');

const SCHEMAS = {
    properties: {
        userName: { description: 'Enter your username', name: 'username', pattern: /^[a-zA-Z0-9\-]+$/, message: 'Username must be only letters, numbers, or dashes' },
        room: { description: 'Join or create room. \nType => join/create roomId and hit enter', name: 'room' }
    }
};

class ChatEngine {
    constructor(io) {
        this.io = io;
        this.stage = 'prep';
        this.userName = '';
        this.roomId = undefined;
        this.socket = undefined;
        this.get = util.promisify(prompt.get);
    }
    async start() {
        this.socket = this.io(process.env.socketURL || 'http://localhost:5000');
        this.socket.on('connect', async () => {
            console.log('Connected with server.');
            process.stdout.destroy();
            prompt.start();
            prompt.message = '';
            this.managePrep();
        });

        this.socket.on('room', data => {
            this.roomId = data.roomId;
            console.log(data.message || 'Error with room.');
            this.manageMessage();
        });

        this.socket.on('message', message => console.log(`\n${message}`));
    }
    async managePrep() {
        try {
            const { userName, room } = await this.get(SCHEMAS);
            this.userName = userName;
            const parts = room.split(" ");
            if (parts.length < 2 || (parts[0] !== 'join' && parts[0] !== 'create')) {
                this.managePrep();
                return console.log('\nInvalid input');
            }
            this.socket.emit('room', { roomId: parts[1], action: parts[0] });
        }
        catch (e) { console.log(e) }
    }

    async manageMessage() {
        try {
            process.stdout.destroy();
            prompt.delimiter = '';
            this.get({ properties: { message: { description: '\r', name: 'message' } } }, (err, { message }) => {
                if (err) return console.log(err);
                message = message + ' - ' + this.userName;
                this.socket.emit('message', { roomId: this.roomId, message }, () => this.manageMessage());
            });
        }
        catch (e) {
            console.log(e)
        }
    }
};

const chat = new ChatEngine(io);
chat.start();