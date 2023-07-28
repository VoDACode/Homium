const fs = require('fs');
const path = require('path');

const args = process.argv;
const options = args.slice(2);

const config = {
    'DB_ADMIN_USER': 'admin',
    'DB_ADMIN_PASS': randomStr(32),
    'DB_HOST': 'localhost',
    'DB_PORT': '27017',
    'DB_DATABASE': 'homium',
    'DB_USER': 'homium_' + randomStr(8),
    'DB_USER_PASS': randomStr(32),
    'LOG_LEVEL': 'INFO',
    'MQTT_HOST': 'localhost',
    'MQTT_PORT': '1883',
    'MQTT_USER': 'homium_' + randomStr(8),
    'MQTT_PASS': randomStr(32),
    'MQTT_TOPIC': 'homium',
};
for (let i = 0; i < options.length; i++) {
    const option = options[i].split('=');
    let key = option[0].replace('--', '');
    if (!config[key]) {
        console.log(`Option ${key} is not valid`);
        continue;
    }
    // Example: --DB_ADMIN_USER="user_dkfdjn/=)"
    // join all parts except first one

    let value = option[1];
    for (let j = 2; j < option.length; j++)
        value = value + '=' + option[j];
    config[key] = value;
}

// copy config file
const exampleConfigPath = path.join(__dirname, 'backend', 'dist', 'src', 'configs', 'example.config.json');
const configPath = path.join(__dirname, 'backend', 'dist', 'src', 'configs', 'secret.config.json');
console.log('Config file path: ' + configPath);
if (!fs.existsSync(configPath)) {
    console.log('First run, copy example config file to secret config file');

    fs.copyFileSync(exampleConfigPath, configPath);

    // write config file
    const configContent = fs.readFileSync(configPath, 'utf8');
    const configJson = JSON.parse(configContent);

    configJson['db']['admin'] = {
        'user': '',
        'password': ''
    }

    configJson['db']['admin']['user'] = config['DB_ADMIN_USER'];
    configJson['db']['admin']['password'] = config['DB_ADMIN_PASS'];
    configJson['db']['host'] = config['DB_HOST'];
    configJson['db']['port'] = config['DB_PORT'];
    configJson['db']['database'] = config['DB_DATABASE'];
    configJson['db']['user'] = config['DB_USER']
    configJson['db']['password'] = config['DB_USER_PASS']

    configJson['log']['level'] = config['LOG_LEVEL'];

    configJson['mqtt']['host'] = config['MQTT_HOST'];
    configJson['mqtt']['port'] = config['MQTT_PORT'];
    configJson['mqtt']['user'] = config['MQTT_USER'];
    configJson['mqtt']['password'] = config['MQTT_PASS'];
    configJson['mqtt']['topic'] = config['MQTT_TOPIC'];

    // write config file
    fs.writeFileSync(configPath, JSON.stringify(configJson, null, 4));
}

function randomStr(length) {
    if (!length)
        length = 8;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}