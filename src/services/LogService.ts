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
        if(level < this.stringLeverToLogLevel(config.log.level)){
            return;
        }
        this.logRecords.push(new LogRecord(level, message, serviceName));
        if(config.log.console){
            let textColor = "";
            if(level >= LogLevel.ERROR){
                textColor = "\x1b[31m";
            } else if(level == LogLevel.WARN){
                textColor = "\x1b[33m";
            }
            console.log(`\x1b[1m[${new Date().toISOString()}]\x1b[0m${this.getTextCollor(level)}\x1b[1m[${LogLevel[level]}]\x1b[0m\x1b[90m[${serviceName}]\x1b[0m${textColor}: ${message}\x1b[0m`);
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

    private stringLeverToLogLevel(level: string): LogLevel {
        level = level.toUpperCase();
        switch (level) {
            case "DEBUG":
                return LogLevel.DEBUG;
            case "INFO":
                return LogLevel.INFO;
            case "WARN":
                return LogLevel.WARN;
            case "ERROR":
                return LogLevel.ERROR;
            case "FATAL":
                return LogLevel.FATAL;
            default:
                return LogLevel.INFO;
        }
    }

    private getTextCollor(level: LogLevel): string {
        switch (level) {
            case LogLevel.DEBUG:
                return "\x1b[34m";
            case LogLevel.INFO:
                return "\x1b[32m";
            case LogLevel.WARN:
                return "\x1b[33m";
            case LogLevel.ERROR:
                return "\x1b[31m";
            case LogLevel.FATAL:
                return "\x1b[31m";
            default:
                return "\x1b[0m";
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
