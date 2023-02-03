import { uuid } from 'uuidv4';
import * as vm from 'vm';
import db from '../db';
import { ScriptArgument, ScriptModel } from '../models/ScriptModel';
import extensions from './extensions';
import { Logger } from './LogService';
import MqttService from './MqttService';
import ObjectService from './ObjectService';

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

class ScriptService {
    private logger: Logger = new Logger("ScriptService");
    private scripts: ScriptStoreModel[] = [];
    private inicelized: boolean = false;

    private static _instance: ScriptService;

    public static get instance(): ScriptService {
        return this._instance || (this._instance = new this());
    }
    private constructor() { }

    async init() {
        if (ScriptService.instance.inicelized == true) {
            return;
        }
        let list = await db.scripts.find().toArray();
        ScriptService.instance.logger.info("Initializing");
        ScriptService.instance.logger.info(`Found ${list.length} script${list.length == 1 ? "" : "s"}`);

        list.forEach(script => {
            ScriptService.instance.logger.debug(`Initializing script ${script.id}`);
            ScriptService.instance.scripts.push(new ScriptStoreModel(script));
            ScriptService.instance.initTarget(script);
            ScriptService.instance.logger.debug(`Initialized script ${script.id}`);
        });

        ScriptService.instance.logger.info("Initialized");
        ScriptService.instance.inicelized = true;
    }

    public async executeScript(id: string, args: ScriptArgument): Promise<any> {
        let context = {
            _context: {
                extensions: {
                    ...extensions.getContext,
                },
                services: {
                    logger: new Logger(`Script ${id}`),
                    mqtt: {
                        publish: async (topic: string, message: string) => {
                            MqttService.publish(topic, message);
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

        let script = this.scripts.find(s => s.script.id === id);
        if (script) {
            return VMService.instance.runScript(script.script.code, context);
        }
        return VMService.instance.runScript(await (await this.loadScript(id)).code, context);
    }

    public async createScript(script: ScriptModel): Promise<string> {
        let id = script.id.length > 0 ? script.id : uuid();
        if ((await db.scripts.countDocuments({ id: id })) > 0) {
            do {
                id = uuid();
            } while ((await db.scripts.countDocuments({ id: id })) > 0);
        }
        script.id = id;
        await db.scripts.insertOne(script);
        await this.initTarget(script);
        return id;
    }

    public async updateScript(script: ScriptModel): Promise<void> {
        let dbScript = await db.scripts.findOne({ id: script.id });
        if (!dbScript) {
            throw new Error("Script not found");
        }
        await db.scripts.updateOne({ id: script.id }, { $set: script });
        const index = this.scripts.findIndex(s => s.script.id === script.id);
        if (index > -1) {
            this.scripts[index] = new ScriptStoreModel(script);
        } else {
            this.scripts.push(new ScriptStoreModel(script));
        }
    }

    public async updateScriptCode(id: string, code: string): Promise<void> {
        let script = await this.getScript(id);
        script.code = code;
        await this.updateScript(script);
    }

    public async isAllowAnonymous(id: string): Promise<boolean> {
        let script = this.scripts.find(s => s.script.id === id);
        if (script) {
            return script.script.allowAnonymous;
        }
        return this.loadScript(id).then(s => s.allowAnonymous);
    }

    public async deleteScript(id: string): Promise<void> {
        const index = this.scripts.findIndex(s => s.script.id === id);
        if (index > -1) {
            this.scripts.splice(index, 1);
        }
        await db.scripts.deleteOne({ id: id });
    }

    public async getIds(): Promise<string[]> {
        return await db.scripts.find().map(s => s.id).toArray();
    }

    public async getScript(id: string): Promise<ScriptModel> {
        let script = this.scripts.find(s => s.script.id === id);
        if (script) {
            return script.script;
        }
        return await this.loadScript(id);
    }

    private async loadScript(id: string): Promise<ScriptModel> {
        let script = await db.scripts.findOne({ id: id });
        if (!script) {
            throw new Error("Script not found");
        }
        await this.initTarget(script);
        this.scripts.push(new ScriptStoreModel(script));
        return script;
    }

    private async initTarget(script: ScriptModel) {
        if (script.targetType === "Object") {
            let obj = await ObjectService.get(script.targetId);
            if (!obj) {
                throw new Error("Object not found");
            }
            ObjectService.addEventListener(obj.id, "remove", () => {
                this.deleteScript(script.id);
            });
            ObjectService.addEventListener(obj.id, script.targetEvent, (args: ScriptArgument) => {
                this.executeScript(script.id, args);
            });
        } else if (script.targetType === "Extension") {
            let ext = extensions.get(script.targetId, 'id');
            if (!ext) {
                throw new Error("Extension not found");
            }
            ext.on(script.targetEvent, (args: ScriptArgument) => {
                this.executeScript(script.id, args);
            });
        }
    }
}

export default ScriptService.instance;