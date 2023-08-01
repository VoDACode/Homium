import * as fs from "fs";
import path from "path";
import config from "../config";
import { Service, ServiceEvent } from "./Service";

export type LogListener = (logRecord: LogRecord) => void;

export type LogServiceEvent = "all" | "debug" | "info" | "warn" | "error" | "fatal" | ServiceEvent;

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}

export class LogRecord {
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

class LogStorage extends Service<LogServiceEvent> {

    public get name(): string {
        return "LogStorage";
    }
    private _onlyConsole: boolean = false;
    public get onlyConsole(): boolean {
        return this._onlyConsole;
    }
    public set onlyConsole(value: boolean) {
        this._onlyConsole = value;
    }
    private logDir: string = path.join(__dirname, "..", "logs");
    private startDate: Date = new Date();
    private startDateToFile: string = this.startDate.toISOString().replace(/:/g, "-");
    private logRecords: LogRecord[] = [];
    private logStack: LogRecord[] = [];
    private handelInterval: NodeJS.Timer | undefined;
    private static _instance: LogStorage;
    private constructor() {
        super();
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
        fs.writeFileSync(path.join(this.logDir, `${this.startDateToFile}.log`), "");
    }

    public start(): Promise<void> {
        if (this.running)
            return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
            this.running = true;
            this.logRecords = [];
            this.logStack = [];
            this.handelInterval = setInterval(this.handel.bind(this), 10);
            this.startDate = new Date();
            this.emit("started");
            this.log(LogLevel.INFO, "Log service started", this.name);
            resolve();
        });
    }

    public stop(): Promise<void> {
        if (!this.running)
            return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
            this.log(LogLevel.INFO, "Log service stopped", this.name);
            this.running = false;
            this.emit("stopped");
            this.clear();
            resolve();
        });
    }

    public static get instance(): LogStorage {
        if (!LogStorage._instance) {
            LogStorage._instance = new LogStorage();
        }
        return LogStorage._instance;
    }

    public log(level: LogLevel, message: string, serviceName: string): void {
        if (!this.running) {
            return;
        }

        let logLevel = config.loaded ? config.data.log.level : "DEBUG";

        if (level < this.stringLeverToLogLevel(logLevel)) {
            return;
        }
        let logRecord = new LogRecord(level, message, serviceName);
        this.logRecords.push(logRecord);
        this.logStack.push(logRecord);
    }

    public clear(): void {
        this.logRecords = [];
    }

    public getLogRecords(): LogRecord[] {
        return this.logRecords;
    }

    public waitToFinish(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let interval = setInterval(() => {
                if (this.logStack.length == 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    private async handel(): Promise<void> {
        if (this.logStack.length > 0) {
            let logRecord = this.logStack.shift();
            if (!logRecord) {
                return;
            }

            let logInConsole = config.loaded ? config.data.log.console : true;
            if (logInConsole || this.onlyConsole) {
                let textColor = "";
                if (logRecord.level >= LogLevel.ERROR) {
                    textColor = "\x1b[31m";
                } else if (logRecord.level == LogLevel.WARN) {
                    textColor = "\x1b[33m";
                }
                console.log(`\x1b[1m[${new Date().toISOString()}]\x1b[0m${this.getTextColor(logRecord.level)}\x1b[1m[${LogLevel[logRecord.level]}]\x1b[0m\x1b[90m[${logRecord.serviceName}]\x1b[0m${textColor}: ${logRecord.message}\x1b[0m`);
            }

            this.emit("all", logRecord);
            this.emit(LogLevel[logRecord.level].toLowerCase() as LogServiceEvent, logRecord);
            if (this.onlyConsole == false) {
                await fs.appendFile(path.join(this.logDir, `${this.startDateToFile}.log`), `[${new Date().toISOString()}][${LogLevel[logRecord.level]}][${logRecord.serviceName}]: ${logRecord.message}\n`, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        } else if (!this.running) {
            clearInterval(this.handelInterval);
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

    private getTextColor(level: LogLevel): string {
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

export class Logger {
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

    public on(event: LogServiceEvent, listener: LogListener): void {
        this.logStorage.on(event, listener);
    }

    public off(event: LogServiceEvent, listener: LogListener): void {
        this.logStorage.off(event, listener);
    }

    public getLogRecords(): LogRecord[] {
        return this.logStorage.getLogRecords();
    }
}

export const logService = LogStorage.instance;
