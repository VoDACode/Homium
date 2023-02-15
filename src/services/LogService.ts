import * as fs from "fs";
import path from "path";
import config from "../config";

export type LogListener = (logRecord: LogRecord) => void;

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
    private logListeners: LogListener[] = [];
    private static _instance: LogStorage;
    private constructor() {
        if(!fs.existsSync(this.logDir)){
            fs.mkdirSync(this.logDir);
        }
        fs.writeFileSync(path.join(this.logDir, `${this.startDateToFile}-all.log`), "");
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
        this.logListeners.forEach((listener) => {
            listener(new LogRecord(level, message, serviceName));
        });
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

    public on(listener: LogListener): void {
        this.logListeners.push(listener);
    }

    public off(listener: LogListener): void {
        const index = this.logListeners.indexOf(listener);
        if(index > -1){
            this.logListeners.splice(index, 1);
        }
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

    public debug(message: string, ...data: string[]): void {
        this._log(LogLevel.DEBUG, message + " " + data.join(" "));
    }

    public info(message: string, ...data: string[]): void {
        this._log(LogLevel.INFO, message + " " + data.join(" "));
    }

    public warn(message: string, ...data: string[]): void {
        this._log(LogLevel.WARN, message + " " + data.join(" "));
    }

    public error(message: string, ...data: string[]): void {
        this._log(LogLevel.ERROR, message + " " + data.join(" "));
    }

    public fatal(message: string, ...data: string[]): void {
        this._log(LogLevel.FATAL, message + " " + data.join(" "));
    }

    private _log(level: LogLevel, message: string): void {
        this.logStorage.log(level, message, this.serviceName);
    }

    public on(listener: LogListener): void {
        this.logStorage.on(listener);
    }

    public off(listener: LogListener): void {
        this.logStorage.off(listener);
    }

    public getLogRecords(): LogRecord[] {
        return this.logStorage.getLogRecords();
    }
}
