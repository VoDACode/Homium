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

class LogStorage extends Service<LogServiceEvent> {

    public get name(): string {
        return "LogStorage";
    }

    private logDir: string = path.join(__dirname, "..", "logs");
    private startDate: Date = new Date();
    private startDateToFile: string = this.startDate.toISOString().replace(/:/g, "-");
    private logRecords: LogRecord[] = [];
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
        let logLevel = config ? config.log.level : "DEBUG";
        let logInConsole = config ? config.log.console : true;
        if (level < this.stringLeverToLogLevel(logLevel)) {
            return;
        }
        this.logRecords.push(new LogRecord(level, message, serviceName));
        if (logInConsole) {
            let textColor = "";
            if (level >= LogLevel.ERROR) {
                textColor = "\x1b[31m";
            } else if (level == LogLevel.WARN) {
                textColor = "\x1b[33m";
            }
            console.log(`\x1b[1m[${new Date().toISOString()}]\x1b[0m${this.getTextColor(level)}\x1b[1m[${LogLevel[level]}]\x1b[0m\x1b[90m[${serviceName}]\x1b[0m${textColor}: ${message}\x1b[0m`);
        }

        this.emit("all", new LogRecord(level, message, serviceName));
        this.emit(LogLevel[level].toLowerCase() as LogServiceEvent, new LogRecord(level, message, serviceName));

        new Promise<void>((resolve, reject) => {
            fs.appendFile(path.join(this.logDir, `${this.startDateToFile}.log`), `[${new Date().toISOString()}][${LogLevel[level]}][${serviceName}]: ${message}\n`, (err) => {
                if (err) {
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
