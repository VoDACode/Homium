import { Service } from "./Service";

import express from 'express';
import { Server } from 'http';
import expressWs from 'express-ws';
import path from 'path';
import db from '../db';
import config from '../config';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as boot from '../boot';
import mqtt from './MqttService';
import { Logger, logService } from './LogService';
import ScriptService from './ScriptService';
import ObjectService from './ObjectService';
import SectorService from './SectorService';
import { platform } from 'os';
import swagger from '../utils/swagger';

class SystemService extends Service<string>{
    private app = express();
    private webServer: Server | undefined;

    private logger: Logger = new Logger("System");

    get name(): string {
        return "System";
    }
    private static _instance: SystemService;
    private constructor() {
        super();
    }
    public static get instance(): SystemService {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }

    public start(): Promise<void> {
        if (this.running)
            return Promise.resolve();
        return new Promise(async (resolve, reject) => {
            this.running = true;
            await logService.start();
            this.logger.info("Starting server...");
            if (platform() != "linux") {
                this.logger.fatal("This application is only supported on linux");
                await this.stop(true);
                return;
            }
            this.logger.info("Loading config...");
            await config.loadConfig();
            this.logger.info("Config loaded");
            this.logger.info("Starting server...");
            await mqtt.start();
            try {
                await db.connect();
                await boot.firstStart();
                await ObjectService.start();
                await ScriptService.start();
                await SectorService.start();
                await this.initWebServer();
                this.emit("started");
            } catch (error: any) {
                this.logger.fatal(error);
                this.logger.fatal("Stopping server...");
                await this.stop();
            }
            resolve();
        });
    }
    public stop(exit: boolean = true): Promise<void> {
        if (!this.running)
            return Promise.resolve();
        return new Promise(async (resolve, reject) => {
            this.running = false;
            this.logger.info("Stopping server...");
            await mqtt.stop();
            await logService.stop();
            if (this.webServer) {
                this.webServer.close();
            }
            this.emit("stopped");

            await logService.waitToFinish();

            console.log("Bye!");
            if (exit)
                process.exit(1);
            resolve();
        });
    }

    public async restart(): Promise<void> {
        await this.stop(false);
        await this.start();
    }

    private async initWebServer() {
        this.logger.info("Starting web server...");
        if (this.webServer) {
            this.webServer.close();
        }
        this.webServer = undefined;
        this.app = express();
        expressWs(this.app);

        this.app.use(bodyParser.json());
        this.app.use(cookieParser());

        this.app.use("/", boot.loadControllers());
        if (config.data.extensions.enabled == true) {
            this.app.use("/", boot.bootExtensions());
        }

        if (config.data.swagger.enabled == true) {
            swagger(this.app);
        }

        this.webServer = this.app.listen(config.data.server.port, () => {
            this.logger.info("Server started on port " + config.data.server.port);
        });
    }
}

export default SystemService.instance;