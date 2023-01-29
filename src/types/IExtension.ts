import db from "../db";
import extensions from "../services/extensions";
import { Logger } from "../services/LogService";

export abstract class IExtension{
    private _id: string;
    private _storage: Storage;
    private _logger: Logger;

    abstract name: string;

    constructor(id: string) {
        this._id = id;
        this._logger = new Logger(`Extension ${id}`);
        this._storage = new Storage(id);
    }

    abstract start(): void;
    abstract stop(): void;

    protected static _getOriginal<T>(path: string): T {
        return extensions.getOriginal(path.split('extensions\\')[1].split("\\")[0], 'folder') as T;
    }

    public restart(): void {
        this.stop();
        this.start();
    }

    public get context(): any {
        return this.context;
    }

    public get id(): string {
        return this._id;
    }

    public get storage(): Storage {
        return this._storage;
    }

    public get logger(): Logger {
        return this._logger;
    }
}

class Storage{
    private _data: any;
    private _id: string;
    private _loaded: boolean = false;
    constructor(id: string) {
        this._id = id;
        this._data = {};
    }
    public async get(key: string): Promise<any> {
        if(this._loaded == false){
            let data = await db.extensions.findOne({id: this._id});
            this._data = data?.storage || {};
        }
        return this._data[key];
    }

    public has(key: string): boolean {
        return this._data[key] != undefined;
    }

    public async add(key: string, value: any): Promise<void> {
        if(this._data[key] == undefined)
            this._data[key] = [];
        this._data[key].push(value);
        await db.extensions.updateOne({id: this._id}, {$set: {storage: this._data}});
    }

    public async remove(key: string, index: number): Promise<void> {
        if(this._data[key] == undefined)
            return;
        if(index < this._data[key].length && index >= 0){
            this._data[key].splice(index, 1);
            await db.extensions.updateOne({id: this._id}, {$set: {storage: this._data}});
        }
    }
    
    public async set(key: string, value: any): Promise<void> {
        this._data[key] = value;
        await db.extensions.updateOne({id: this._id}, {$set: {storage: this._data}});
    }

    public async delete(key: string): Promise<void> {
        delete this._data[key];
        await db.extensions.updateOne({id: this._id}, {$set: {storage: this._data}});
    }

    public async clear(): Promise<void> {
        this._data = {};
        await db.extensions.updateOne({id: this._id}, {$set: {storage: this._data}});
    }
}