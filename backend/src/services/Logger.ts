import { serviceManager, ILogService, ILogger } from "homium-lib/services";
import { LogLevel, LogListener, LogRecord, LogServiceEvent } from "homium-lib/types/log.types";

export class Logger implements ILogger{
    private _loggerName: string;
    private logService: ILogService;

    constructor(loggerName: string){
        this._loggerName = loggerName;
        this.logService = serviceManager.get(ILogService);
    }

    public get loggerName(): string {
        return this._loggerName;
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
        this.logService.log(level, message, this._loggerName);
    }

    public getLogRecords(): LogRecord[] {
        return this.logService.getLogRecords();
    }

    public on(event: LogServiceEvent, listener: LogListener): void {
        this.logService.on(event, listener);
    }
    public off(event: LogServiceEvent, listener: LogListener): void {
        this.logService.off(event, listener);
    }
}