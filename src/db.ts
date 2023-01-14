import {Db, MongoClient} from 'mongodb';
import config from './config';
import { Session } from './models/Session';
import { UserModel } from './models/UserModel';

export class Database {
    private static _instance: Database;
    private constructor() { }
    public static get getInstance(): Database {
        return this._instance || (this._instance = new this());
    }
    private _db: MongoClient | undefined;
    public get db(): Db {
        if (!this._db) {
            throw new Error('Database not connected');
        }
        return this._db.db(config.db.database);
    }
    async connect() {
        if (this._db) {
            return;
        }
        this._db = await MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}`);
    }
    public get users() {
        return this.db.collection<UserModel>('users');
    }
    public get sessions() {
        return this.db.collection<Session>('sessions');
    }
}

export default Database.getInstance;
