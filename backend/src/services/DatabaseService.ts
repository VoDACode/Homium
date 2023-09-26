import {Collection, Db, MongoClient} from 'mongodb';
import { DatabaseServiceEvents } from 'homium-lib/types/db.types';
import { serviceManager, BaseService, IConfigService, IDatabaseService, ILogger } from 'homium-lib/services';
import { BotModel, ExtensionModel, ObjectModel, SceneModel, ScriptModel, SectorModel, SessionModel, UserModel } from 'homium-lib/models';

export class DatabaseService extends BaseService<DatabaseServiceEvents> implements IDatabaseService {

    private logger: ILogger;
    private configService: IConfigService;
    private _db: MongoClient | undefined;
    public get db(): Db {
        if (!this._db) {
            throw new Error('Database not connected');
        }
        return this._db.db(this.configService.config.db.database);
    }

    public get name(): string {
        return 'DatabaseService';
    }

    constructor(){
        super();
        this.configService = serviceManager.get(IConfigService);
        this.logger = serviceManager.get(ILogger, 'DatabaseService');
    }

    public start(): Promise<void> {
        return this.connect();
    }
    public stop(): Promise<void> {
        if (this._db) {
            return this._db.close();
        }
        return Promise.resolve();
    }

    public async connect() {
        if (this._db) {
            return;
        }
        this._db = await MongoClient.connect(`mongodb://${encodeURIComponent(this.configService.config.db.user)}:${encodeURIComponent(this.configService.config.db.password)}@`+
                                            `${this.configService.config.db.host}:${this.configService.config.db.port}/?authMechanism=DEFAULT&authSource=${this.configService.config.db.database}`);
        this._db.on('close', () => {
            this.emit('close');
            this.logger.warn('Connection to database closed');
        });
        this._db.on('error', (err) => {
            this.emit('error', err);
            this.logger.error(err.message);
        });
        this._db.on('timeout', () => {
            this.emit('timeout');
            this.logger.warn('Connection to database timeout');
        });
        this._db.on('reconnecting', () => {
            this.emit('reconnecting');
            this.logger.warn('Reconnecting to database');
        });
        this._db.on('reconnected', () => {
            this.emit('reconnected');
            this.logger.info('Reconnected to database');
        });
        this._db.on('disconnected', () => {
            this.emit('disconnected');
            this.logger.warn('Disconnected from database');
        });
        this.emit('ready');
        this.logger.info('Database connection - successful!');
    }

    public get users() {
        return this.db.collection<UserModel>('users');
    }

    public get sessions() : Collection<SessionModel> {
        return this.db.collection<SessionModel>('sessions');
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
