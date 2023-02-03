import express from 'express';
import expressWs from 'express-ws';
import path from 'path';
import db from './db';
import config from './config';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as boot from './boot';
import {Logger} from './services/LogService';
import ScriptService from './services/ScriptService';

const app = express();
expressWs(app);
const port = config.server.port || process.env.PORT;
if(!port) 
    throw new Error("Port not found");
process.env.PORT = port.toString();
const logger = new Logger("main");

(async() => {
    logger.info("Starting server...");
    try {
        await db.connect();
        await boot.firstStart();
        await start();
    } catch (error: any) {
        logger.fatal(error);
        process.exit(1);
    }
})();

async function start(){
    app.use(bodyParser.json());
    app.use(cookieParser());
    
    app.use("/app/static", express.static(path.join(__dirname, 'static')));
    logger.info("Static files served from: " + path.join(__dirname, 'static'));

    app.use("/", boot.loadControllers());
    app.use("/", boot.bootExtensions());

    await ScriptService.init();
    
    app.use("/", require('./router'));
    app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
}