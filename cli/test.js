const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

// Logs a message keeping prompt on last line
function log(message) {
    readline.cursorTo(process.stdout, 0);
    console.log(message);
    rl.prompt(false);
}

// Testing the solution

const question = () => {
    rl.question('Enter something...:', userInput => {
        question();
    });
};

question();

log('this should appear above the prompt');
setInterval(
    () => log('this should appear above the prompt'),
    4000
);