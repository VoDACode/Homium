import express from 'express';
import { Server } from 'http';
import expressWs from 'express-ws';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as boot from '../boot';
import { platform } from 'os';
import swagger from '../utils/swagger';
import { serviceManager, ISystemService, BaseService, ILogger, ILogService, IConfigService, IMqttService, IDatabaseService, IObjectService, IScriptService, ISectorService } from 'homium-lib/services';

export class SystemService extends BaseService<string> implements ISystemService{
    private app = express();
    private webServer: Server | undefined;

    get name(): string {
        return "System";
    }

    constructor() {
        super();
    }

    public start(): Promise<void> {
        if (this.running)
            return Promise.resolve();
        return new Promise(async (resolve, reject) => {
            let config = serviceManager.get(IConfigService);
            console.log("Loading config...");
            await config.loadConfig();
            console.log("Config loaded");

            this.running = true;

            let logService = serviceManager.get(ILogService);
            let logger = serviceManager.get(ILogger, this.name);

            let mqtt = serviceManager.get(IMqttService);
            let db = serviceManager.get(IDatabaseService);
            let objectService = serviceManager.get(IObjectService);
            let scriptService = serviceManager.get(IScriptService);
            let sectorService = serviceManager.get(ISectorService);
            
            await logService.start();
            logger.info("Starting server...");
            if (platform() != "linux") {
                logger.fatal("This application is only supported on linux");
                //await this.stop(true);
                //return;
            }
            logger.info("Starting server...");
            await mqtt.start();
            try {
                await db.connect();
                await boot.firstStart();
                await objectService.start();
                await scriptService.start();
                await sectorService.start();
                await this.initWebServer();
                this.emit("started");
            } catch (error: any) {
                logger.fatal(error);
                logger.fatal("Stopping server...");
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
            let logger = serviceManager.get(ILogger, this.name);
            logger.info("Stopping server...");
            let logService = serviceManager.get(ILogService);
            let mqtt = serviceManager.get(IMqttService);
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
        let logger = serviceManager.get(ILogger, this.name);
        let configService = serviceManager.get(IConfigService);
        logger.info("Starting web server...");
        if (this.webServer) {
            this.webServer.close();
        }
        this.webServer = undefined;
        this.app = express();
        expressWs(this.app);

        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        boot.loadControllers(this.app);
        if (configService.config.extensions.enabled == true) {
            boot.bootExtensions(this.app);
        }

        logger.info("Loading proxy...");
        this.app.use(require('../router'));
        logger.info("Proxy loaded");

        if (configService.config.swagger.enabled == true) {
            logger.info("Loading swagger...");
            swagger(this.app);
            logger.info("Swagger loaded");
        }

        this.webServer = this.app.listen(configService.config.server.port, () => {
            logger.info("Server started on port " + configService.config.server.port);
        });
    }
}