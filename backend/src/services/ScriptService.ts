import { ScriptModel } from 'homium-lib/models';
import { serviceManager, BaseService, IConfigService, IDatabaseService, IExtensionsService, ILogger, IMqttService, IObjectService, IScriptService } from 'homium-lib/services';
import { ScriptArgument, ScriptServiceEvent } from 'homium-lib/types/script.types';
import { uuid } from 'uuidv4';
import * as vm from 'vm';
import { ObjectService } from './ObjectService';

class VMService {
    private static _instance: VMService;
    public static get instance(): VMService {
        return this._instance || (this._instance = new this());
    }
    private constructor() { }

    public runScript(code: string, context: any): any {
        const sandbox = context;
        const script = new vm.Script(code);
        return script.runInNewContext(sandbox);
    }
}

class ScriptStoreModel {
    uploadedAt: Date;
    updatedAt: Date;
    private _script: ScriptModel;
    constructor(script: ScriptModel) {
        this.uploadedAt = new Date();
        this.updatedAt = new Date();
        this._script = script;
    }

    get script(): ScriptModel {
        this.updatedAt = new Date();
        return this._script;
    }
}

export class ScriptService extends BaseService<ScriptServiceEvent> implements IScriptService {

    public get name(): string {
        return 'ScriptService';
    }

    private logger: ILogger;
    private db: IDatabaseService;
    private extensionService: IExtensionsService;
    private mqttService: IMqttService;
    private objectService: IObjectService;
    private configService: IConfigService;


    private scripts: ScriptStoreModel[] = [];


    constructor() {
        super();
        this.logger = serviceManager.get(ILogger, this.name);
        this.db = serviceManager.get(IDatabaseService);
        this.extensionService = serviceManager.get(IExtensionsService);
        this.mqttService = serviceManager.get(IMqttService);
        this.objectService = serviceManager.get(IObjectService);
        this.configService = serviceManager.get(IConfigService);
    }

    public async start(): Promise<void> {
        if (this.running || this.warning)
            return Promise.resolve();
        this.warning = true;
        this.logger.info("Starting");
        let list = await this.db.scripts.find().toArray();
        this.logger.info(`Found ${list.length} script${list.length == 1 ? "" : "s"}`);
        list.forEach(script => {
            try {
                this.logger.debug(`Initializing script ${script.id}`);
                this.scripts.push(new ScriptStoreModel(script));
                this.initTarget(script);
                this.logger.debug(`Initialized script ${script.id}`);
            } catch (e) {
                this.logger.error(`Error initializing script ${script.id}.`);
            }
        });
        this.emit("loaded", list.length);
        this.logger.info("Started");
        this.emit("started");
        this.running = true;
        this.warning = false;
        return Promise.resolve();
    }

    public async stop(): Promise<void> {
        if (!this.running || this.warning)
            return Promise.resolve();
        this.warning = true;
        this.logger.info("Stopping");
        this.running = false;
        this.scripts = [];
        this.emit("stopped");
        this.logger.info("Stopped");
        this.warning = false;
        return Promise.resolve();
    }

    public async executeScript(id: string, args: ScriptArgument): Promise<any> {
        this.validateRunning();
        for (let arg of Object.keys(args)) {
            if (arg == "context") {
                throw new Error("Argument 'context' is reserved");
            }
        }
        let context = {
            context: {
                extensions: {
                    ...this.extensionService.getContext,
                },
                services: {
                    logger: serviceManager.get(ILogger, `Script ${id}`),
                    mqtt: {
                        publish: async (topic: string, message: string) => {
                            this.mqttService.publish(topic, message);
                        },
                    }
                },
                executeScript: async (scriptId: string) => {
                    if (id == scriptId) {
                        throw new Error("Recursive call");
                    }
                    return await this.executeScript(id, args);
                },
            },
            ...args
        };
        let script = this.scripts.find(s => s.script.id === id)?.script ?? await this.loadScript(id);
        if (script && script.enabled) {
            return VMService.instance.runScript(script.code, context);
        } if (script && !script.enabled) {
            throw new Error("Script is disabled");
        } else {
            throw new Error("Script not found");
        }
    }

    public async createScript(script: ScriptModel): Promise<string> {
        this.validateRunning();
        let id = script.id.length > 0 ? script.id : uuid();
        if ((await this.db.scripts.countDocuments({ id: id })) > 0) {
            do {
                id = uuid();
            } while ((await this.db.scripts.countDocuments({ id: id })) > 0);
        }
        script.id = id;
        await this.db.scripts.insertOne(script);
        await this.initTarget(script);
        return id;
    }

    public async updateScript(script: ScriptModel): Promise<void> {
        this.validateRunning();
        let dbScript = await this.db.scripts.findOne({ id: script.id });
        if (!dbScript) {
            throw new Error("Script not found");
        }
        await this.db.scripts.updateOne({ id: script.id }, { $set: script });
        const index = this.scripts.findIndex(s => s.script.id === script.id);
        if (index > -1) {
            this.scripts[index] = new ScriptStoreModel(script);
        } else {
            this.scripts.push(new ScriptStoreModel(script));
        }
    }

    public async updateScriptCode(id: string, code: string): Promise<void> {
        this.validateRunning();
        let script = await this.getScript(id);
        script.code = code;
        await this.updateScript(script);
    }

    public async isAllowAnonymous(id: string): Promise<boolean> {
        this.validateRunning();
        let script = this.scripts.find(s => s.script.id === id);
        if (script) {
            return script.script.allowAnonymous;
        }
        return this.loadScript(id).then(s => s.allowAnonymous);
    }

    public async deleteScript(id: string): Promise<void> {
        this.validateRunning();
        const index = this.scripts.findIndex(s => s.script.id === id);
        if (index > -1) {
            this.scripts.splice(index, 1);
        }
        await this.db.scripts.deleteOne({ id: id });
    }

    public async getIds(): Promise<string[]> {
        this.validateRunning();
        return await this.db.scripts.find().map(s => s.id).toArray();
    }

    public async getScript(id: string): Promise<ScriptModel> {
        this.validateRunning();
        let script = this.scripts.find(s => s.script.id === id);
        if (script) {
            return script.script;
        }
        return await this.loadScript(id);
    }

    private async loadScript(id: string): Promise<ScriptModel> {
        let script = await this.db.scripts.findOne({ id: id });
        if (!script) {
            throw new Error("Script not found");
        }
        await this.initTarget(script);
        this.scripts.push(new ScriptStoreModel(script));
        return script;
    }

    private async initTarget(script: ScriptModel) {
        if (script.targetType === "Object") {
            let obj = await this.objectService.get(script.targetId);
            if (!obj) {
                this.logger.error(`Script ${script.id} is targeted to object ${script.targetId} but object is not loaded.`);
                return;
            }
            this.objectService.addEventListener(obj.id, "remove", () => {
                if (script.enabled == false) {
                    return;
                }
                this.deleteScript(script.id);
            });
            this.objectService.addEventListener(obj.id, script.targetEvent, (args: ScriptArgument) => {
                if (script.enabled == false) {
                    return;
                }
                try {
                    this.executeScript(script.id, args);
                } catch (e) {
                    this.logger.error(`Error executing script ${script.id}.`);
                }
            });
        } else if (script.targetType === "Extension") {
            if (this.configService.config.extensions.enabled == false) {
                this.logger.warn(`Script ${script.id} is targeted to extension ${script.targetId} but extensions are disabled.`);
                return;
            }
            let ext = this.extensionService.get(script.targetId, 'id');
            if (!ext) {
                this.logger.error(`Script ${script.id} is targeted to extension ${script.targetId} but extension is not loaded.`);
                return;
            }
            ext.on(script.targetEvent, (args: ScriptArgument) => {
                if (script.enabled == false) {
                    return;
                }
                try {
                    this.executeScript(script.id, args);
                } catch (e) {
                    this.logger.error(`Error executing script ${script.id}.`);
                }
            });
        }
    }
}