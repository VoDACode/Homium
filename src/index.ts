import express from 'express';
import path from 'path';
import db from './db';
import config from './config';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as boot from './boot';

const app = express();
const port = config.server.port || process.env.PORT;

(async() => {
    await db.connect();
    await boot.firstStart();
    start();
})();

function start(){
    app.use(bodyParser.json());
    app.use(cookieParser());
    
    app.use("/app/static", express.static(path.join(__dirname, 'static')));
    
    app.use("/", boot.loadControllers());
    app.use("/", boot.bootExtensions());
    
    app.use("/", require('./router'));
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}