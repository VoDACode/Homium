import { IConfigModel } from "./models/IConfigModel";
import { readFileSync, existsSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import { Logger } from "./services/LogService";

const logger = new Logger('Config');

class Config {
    static get configFile(): string {
        return join(__dirname, 'configs', 'secret.config.json');
    }
    private static _instance: Config;
    private constructor() {
        if (existsSync(Config.configFile)) {
            let file = readFileSync(Config.configFile, 'utf8');
            this._config = JSON.parse(file);
            try {
                this.validateConfig();
            } catch (error: any) {
                logger.error(error.message);
                process.exit(1);
            }
        } else {
            copyFileSync(join(__dirname, 'configs', 'example.config.json'), Config.configFile);
            logger.info('Config file created');
            logger.info('Please fill the config file');
            logger.info('Path: ' + Config.configFile);
            logger.info('Exiting...');
            process.exit(0);
        }
    }
    public static get Instance(): Config {
        return this._instance || (this._instance = new this());
    }
    private _config: IConfigModel;

    public get config(): IConfigModel {
        return this._config;
    }

    private validateConfig(): void {
        if (!existsSync(Config.configFile) || this._config == null)
            throw new Error('Config file not found');

        // validate config
        if (this._config.server == null)
            throw new Error('server: config not found');
        validatePort('server.port', this._config.server.port);

        if (this._config.db == null)
            throw new Error('db: config not found');
        validateString('db.host', this._config.db.host);
        validatePort('db.port', this._config.db.port);
        validateString('db.user', this._config.db.user);
        validatePassword('db.password', this._config.db.password);
        validateString('db.database', this._config.db.database);

        if (this._config.mqtt == null)
            throw new Error('mqtt: config not found');
        if (this._config.mqtt.enabled == null)
            throw new Error('mqtt.enabled: config not found');
        validateString('mqtt.host', this._config.mqtt.host);
        validatePort('mqtt.port', this._config.mqtt.port);
        validateString('mqtt.user', this._config.mqtt.user);
        validatePassword('mqtt.password', this._config.mqtt.password);
        validateString('mqtt.topic', this._config.mqtt.topic);

        if (this._config.extensions == null)
            throw new Error('extensions: config not found');
        if (this._config.extensions.enabled == null)
            throw new Error('extensions.enabled: config not found');

        if (this._config.log == null)
            throw new Error('log: config not found');
        validateString('log.level', this._config.log.level);
        if (this._config.log.console == null)
            throw new Error('log.console: config not found');

        if (this._config.DEBUG == null)
            throw new Error('DEBUG: config not found');
        if (this._config.DEBUG.debug == null)
            throw new Error('DEBUG.debug: config not found');
        if (this._config.DEBUG.allowAnonymous == null)
            throw new Error('DEBUG.allowAnonymous: config not found');
        if (this._config.DEBUG.checkRights == null)
            throw new Error('DEBUG.checkRights: config not found');

        function validatePort(paramName: string, port: number | undefined): void {
            if (port == null)
                throw new Error(paramName + ': not found');
            if (port < 0 || port > 65535)
                throw new Error(paramName + ': must be between 0 and 65535');
        }

        function validateString(paramName: string, value: string | undefined): void {
            if (value == null)
                throw new Error(paramName + ': not found');
            if (value.length == 0)
                throw new Error(paramName + ': is empty');
        }

        function validatePassword(paramName: string, value: string | undefined): void {
            if (value == null)
                throw new Error(paramName + ': not found');
            if (value.length < 8)
                throw new Error(paramName + ': must be greater than 8');
        }
    }
}

export default Config.Instance.config;