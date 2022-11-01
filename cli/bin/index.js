#! /usr/bin/env node

const { io } = require('socket.io-client');

const socket = io(process.env.socketURL || 'http://localhost:5000');

socket.on('connect', () => console.log('connected'));