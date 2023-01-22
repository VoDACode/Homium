import { ObjectModel } from "../models/ObjectModel";
import { ObjectEventType } from "../types/ObjectEventType";
import db from "../db";

type UpdateEvent = (object: ObjectModel) => void;
type PropertyUpdateEvent = (object: ObjectModel, property: string, value: any) => void;

class ObjectEventService {
    private _eventMap: Map<string, Array<Function>>;

    constructor() {
        this._eventMap = new Map<string, Array<Function>>();
    }

    public addEventListener(eventType: ObjectEventType, callback: Function): void {
        if (!this._eventMap.has(eventType)) {
            this._eventMap.set(eventType, []);
        }
        this._eventMap.get(eventType)?.push(callback);
    }

    public removeEventListener(eventType: ObjectEventType, callback: Function): void {
        if (this._eventMap.has(eventType)) {
            let callbacks = this._eventMap.get(eventType);
            if (callbacks) {
                let index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }

    public dispatchEvent(eventType: ObjectEventType, ...args: any[]): void {
        if (this._eventMap.has(eventType)) {
            this._eventMap.get(eventType)?.forEach((callback) => {
                callback(...args);
            });
        }
    }

    public get eventsSupported(): string[] {
        return Array.from(this._eventMap.keys());
    }
}

class StoredObject {
    object: ObjectModel;
    events: ObjectEventService;
    constructor(object: ObjectModel, events: ObjectEventService) {
        this.object = object;
        this.events = events;
    }
}

class ObjectStorage {
    private _saveDelay: number = 1000 * 10;
    private _saveInterval: NodeJS.Timeout | undefined;
    private _changed: boolean = false;
    get saveDelay(): number {
        return this._saveDelay;
    }

    set saveDelay(value: number) {
        this._saveDelay = value;
        if (this._saveInterval) {
            clearTimeout(this._saveInterval);
            this._saveInterval = undefined;
        }
        this._saveInterval = setInterval(() => {
            this.save();
        }, this._saveDelay);
    }

    private constructor() {
        this._saveInterval = setInterval(() => {
            this.save();
        }, this._saveDelay);
    }

    private static _instance: ObjectStorage;
    public static get instance(): ObjectStorage {
        return this._instance || (this._instance = new this());
    }

    private objects: StoredObject[] = [];

    get count(): number {
        return this.objects.length;
    }

    async add(object: ObjectModel): Promise<boolean> {
        if (this.objects.find(o => o.object.id === object.id))
            return false;
        this.objects.push(new StoredObject(object, new ObjectEventService()));
        await db.objects.insertOne(object);
        return true;
    }

    async get(id: string): Promise<ObjectModel | undefined> {
        let object = this.objects.find((o) => o.object.id === id);
        if (!object) {
            let objFromDb = await db.objects.findOne({ id: id });
            if (!objFromDb) {
                return undefined;
            }
            this.objects.push(new StoredObject(objFromDb, new ObjectEventService()));
            return objFromDb;
        }
        return object.object;
    }

    async remove(id: string): Promise<boolean> {
        const index = this.objects.findIndex((o) => o.object.id === id);
        if (index > -1) {
            await db.objects.deleteOne({ id: id });
            this.objects.splice(index, 1);
            return true;
        }
        return false;
    }

    update(id: string, prop: string, value: any): boolean {
        const index = this.objects.findIndex((o) => o.object.id === id);
        if (index > -1) {
            this.objects[index].events.dispatchEvent('update', this.objects[index].object);
            this.objects[index].events.dispatchEvent('propertyUpdate', this.objects[index].object, prop, value);
            this._changed = true;
            return true;
        }
        return false;
    }

    addEventListener(id: string, eventType: ObjectEventType, callback: UpdateEvent | PropertyUpdateEvent | Function): boolean {
        const object = this.objects.find((o) => o.object.id === id);
        if (object) {
            object.events.addEventListener(eventType, callback);
            return true;
        }
        return false;
    }

    removeEventListener(id: string, eventType: ObjectEventType, callback: Function): boolean {
        const object = this.objects.find((o) => o.object.id === id);
        if (object) {
            object.events.removeEventListener(eventType, callback);
            return true;
        }
        return false;
    }

    private save() {
        if (!this._changed) {
            return;
        }
        this._changed = false;
        console.log('Saving objects...');
        this.objects.forEach(async (o) => {
            await db.objects.updateOne({ id: o.object.id }, {
                $set: {
                    properties: o.object.properties,
                    description: o.object.description,
                    name: o.object.name,
                    parentId: o.object.parentId,
                    allowAnonymous: o.object.allowAnonymous,
                    systemObject: o.object.systemObject,
                    children: o.object.children
                }
            });
        });
        console.log('Objects saved.');
    }
}

export default ObjectStorage.instance;