import * as fs from "fs";
import path from "path";
import archiver from "archiver";
import config from "../config";

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}

class LogRecord {
    public level: LogLevel;
    public message: string;
    public serviceName: string;
    public timestamp: Date;

    constructor(level: LogLevel, message: string, serviceName: string) {
        this.level = level;
        this.message = message;
        this.serviceName = serviceName;
        this.timestamp = new Date();
    }
}

class LogStorage{
    private logDir: string = path.join(__dirname, "..", "logs");
    private startDate: Date = new Date();
    private startDateToFile: string = this.startDate.toISOString().replace(/:/g, "-");
    private logRecords: LogRecord[] = [];
    private static _instance: LogStorage;
    private constructor() {
        if(!fs.existsSync(this.logDir)){
            fs.mkdirSync(this.logDir);
        }
        fs.writeFileSync(path.join(this.logDir, `${this.startDateToFile}-all.log`), "");
        process.on('exit', () => {
            let archiv = archiver('zip', {
                zlib: { level: 9 },
            });
            archiv.file(path.join(this.logDir, `${this.startDateToFile}-all.log`), { name: `${this.startDateToFile}-all.log.zip` });
            archiv.finalize();
        });
    }
    public static get instance(): LogStorage {
        if (!LogStorage._instance) {
            LogStorage._instance = new LogStorage();
        }
        return LogStorage._instance;
    }

    public log(level: LogLevel, message: string, serviceName: string): void {
        this.logRecords.push(new LogRecord(level, message, serviceName));
        if(config.log.console){
            console.log(`[${new Date().toISOString()}][${LogLevel[level]}][${serviceName}]: ${message}`);
        }
        new Promise<void>((resolve, reject) => {
            fs.appendFile(path.join(this.logDir, `${this.startDateToFile}-all.log`), `[${new Date().toISOString()}][${LogLevel[level]}][${serviceName}]: ${message}\n`, (err) => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public clear(): void {
        this.logRecords = [];
    }

    public getLogRecords(): LogRecord[] {
        return this.logRecords;
    }
}

export class Logger{
    private logStorage: LogStorage;
    private serviceName: string;
    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.logStorage = LogStorage.instance;
    }

    public log(level: LogLevel, message: string): void {
        this._log(level, message);
    }

    public debug(message: string): void {
        this._log(LogLevel.DEBUG, message);
    }

    public info(message: string): void {
        this._log(LogLevel.INFO, message);
    }

    public warn(message: string): void {
        this._log(LogLevel.WARN, message);
    }

    public error(message: string): void {
        this._log(LogLevel.ERROR, message);
    }

    public fatal(message: string): void {
        this._log(LogLevel.FATAL, message);
    }

    private _log(level: LogLevel, message: string): void {
        this.logStorage.log(level, message, this.serviceName);
    }
}
