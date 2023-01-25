const cp = require('child_process');
const path = require('path');

const commands = [
    { command: "start nodemon ./src/index.ts", cwd: path.resolve(__dirname, '..'), _process: undefined },
    { command: "start npm run start", cwd: path.resolve(__dirname, '..', 'ClientApp'), _process: undefined }
];

console.log('Starting debug mode...\n\n');

commands.forEach(async command => {
    console.log(`Running command: ${command.command} in ${command.cwd}`);
    command._process = cp.exec(command.command, {
        cwd: command.cwd
    }, (error, stdout, stderr) => callback(command.command, error, stdout, stderr));
});

function callback(command, error, stdout, stderr) {
    console.log(arguments);
    let str = `[${command}]:\t`;
    if (error) {
        str += `error: ${error}`;
        return;
    } else {
        stdout += `output: ${stdout}`;
    }
    console.log(str);
}

process.on('exit', () => {
    commands.forEach(command => {
        if (command._process) {
            command._process.kill(0);
        }
    });
});