import { IConfigModel } from "./models/IConfigModel";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

class Config {
    static get configFile(): string {
        return join(__dirname, 'config.json');
    }
    private static _instance: Config;
    private constructor() { 
        if (existsSync(Config.configFile)) {
            let file = readFileSync(Config.configFile, 'utf8');
            this._config = JSON.parse(file);
        }else{
            throw new Error("Config file not found");
        }
    }
    public static get Instance(): Config {
        return this._instance || (this._instance = new this());
    }
    private _config: IConfigModel;

    public get config(): IConfigModel {
        return this._config;
    }

    loadConfig() {
        let file = readFileSync('./config.json', 'utf8');
        this._config = JSON.parse(file);
    }
}

export default Config.Instance.config;