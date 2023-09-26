import { readFileSync, existsSync, copyFileSync } from "fs";
import { IConfigScheme } from "homium-lib/schemas";
import { serviceManager, IConfigService, ISystemService } from "homium-lib/services";
import { join } from "path";

export class ConfigService implements IConfigService {
    private _loaded: boolean = false;

    private system: ISystemService;

    public get loaded(): boolean {
        return this._loaded;
    }
    constructor() {
        this._config = {} as IConfigScheme;
        this.system = serviceManager.get(ISystemService);
    }
    public getPath(): string {
        return join(__dirname, '..', 'configs', 'secret.config.json');
    }
    
    private _config: IConfigScheme;

    public get config(): IConfigScheme {
        return this._config;
    }

    public async loadConfig(): Promise<void> {
        if(this.loaded){
            return;
        }
        if (existsSync(this.getPath())) {
            let file = readFileSync(this.getPath(), 'utf8');
            this._config = JSON.parse(file);
            try {
                this.validateConfig();
                this._loaded = true;
            } catch (error: any) {
                console.log(error.message);
                await this.system.stop(true);
            }
        } else {
            copyFileSync(join(__dirname, '..', 'configs', 'example.config.json'), this.getPath());

            console.log('Config file created');
            console.log('Please fill the config file');
            console.log('Path: ' + this.getPath());
            console.log('Exiting...');
            await this.system.stop(true);
        }
    }

    private validateConfig(): void {
        if (!existsSync(this.getPath()) || this._config == null)
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
