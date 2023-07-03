import express from 'express';
import expressWs from 'express-ws';
import path from 'path';
import db from './db';
import config from './config';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as boot from './boot';
import mqtt from './services/MqttService';
import { Logger, logService } from './services/LogService';
import ScriptService from './services/ScriptService';
import ObjectService from './services/ObjectService';
import SectorService from './services/SectorService';
import { platform } from 'os';
import swagger from './utils/swagger';

if (platform() != "linux") {
    console.error("This application is only supported on linux");
    process.exit(1);
}

const app = express();
expressWs(app);
const port = config.server.port || process.env.PORT;
if (!port)
    throw new Error("Port not found");
process.env.PORT = port.toString();
const logger = new Logger("main");

(async () => {
    await logService.start();
    logger.info("Starting server...");
    await mqtt.start();
    try {
        await db.connect();
        await boot.firstStart();
        await ObjectService.start();
        await ScriptService.start();
        await SectorService.start();
        await start();
    } catch (error: any) {
        logger.fatal(error);
        await mqtt.stop();
        await logService.stop();
        process.exit(1);
    }
})();

async function start() {
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use("/app/static", express.static(path.join(__dirname, 'static')));
    logger.info("Static files served from: " + path.join(__dirname, 'static'));

    app.use("/", boot.loadControllers());
    if (config.extensions.enabled == true) {
        app.use("/", boot.bootExtensions());
    }

    app.use("/", require('./router'));

    if (config.swagger.enabled == true)
        swagger(app);

    app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
}