import {Db, MongoClient} from 'mongodb';
import config from './config';
import { BotModel } from './models/BotModel';
import { ExtensionModel } from './models/ExtensionModel';
import { ObjectModel } from './models/ObjectModel';
import { SceneModel } from './models/SceneModel';
import { ScriptModel } from './models/ScriptModel';
import { SectorModel } from './models/SectorModel';
import { Session } from './models/Session';
import { UserModel } from './models/UserModel';
import { Logger } from './services/LogService';

export class Database {
    private logger = new Logger('DB');
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
        return this._db.db(config.data.db.database);
    }
    async connect() {
        if (this._db) {
            return;
        }
        this._db = await MongoClient.connect(`mongodb://${encodeURIComponent(config.data.db.user)}:${encodeURIComponent(config.data.db.password)}@${config.data.db.host}:${config.data.db.port}/?authMechanism=DEFAULT&authSource=${config.data.db.database}`);
        this._db.on('close', () => {
            this.logger.warn('Connection to database closed');
        });
        this._db.on('error', (err) => {
            this.logger.error(err.message);
        });
        this.logger.info('Database connection - successful!');
    }
    public get users() {
        return this.db.collection<UserModel>('users');
    }
    public get sessions() {
        return this.db.collection<Session>('sessions');
    }
    public get extensions() {
        return this.db.collection<ExtensionModel>('extensions');
    }
    public get objects() {
        return this.db.collection<ObjectModel>('objects');
    }
    public get scripts() {
        return this.db.collection<ScriptModel>('scripts');
    }
    public get scenes() {
        return this.db.collection<SceneModel>('scenes');
    }
    public get sectors() {
        return this.db.collection<SectorModel>('sectors');
    }
    public get bots() {
        return this.db.collection<BotModel>('bots');
    }
}

export default Database.getInstance;