import { ObjectModel } from "../models/ObjectModel";
import { ObjectEventType } from "../types/ObjectEventType";
import db from "../db";
import mqtt from "./MqttService";
import { convertAnyToCorrectType } from "../models/ObjectProperty";
import config from "../config";
import { Logger } from "./LogService";
import { ScriptArgument, ScriptTargetEvent } from "../models/ScriptModel";
import { Service } from "./Service";

type UpdateEvent = (object: ObjectModel) => void;
type PropertyUpdateEvent = (object: ObjectModel, property: string, value: any) => void;

class ObjectEventService {
    private _eventMap: Map<string, Array<Function>>;

    constructor() {
        this._eventMap = new Map<string, Array<Function>>();
    }

    public addEventListener(eventType: ObjectEventType | ScriptTargetEvent, callback: Function): void {
        if (!this._eventMap.has(eventType)) {
            this._eventMap.set(eventType, []);
        }
        this._eventMap.get(eventType)?.push(callback);
    }

    public removeEventListener(eventType: ObjectEventType | ScriptTargetEvent, callback: Function): void {
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

    public dispatchEvent(eventType: ObjectEventType | ScriptTargetEvent, ...args: any[]): void {
        if (this._eventMap.has(eventType)) {
            this._eventMap.get(eventType)?.forEach((callback) => {
                callback(...args);
            });
        }
    }

    public get eventsSupported(): string[] {
        return Array.from(this._eventMap.keys());
    }

    public get list(): Map<string, Array<Function>> {
        return this._eventMap;
    }
}

class StoredObject {
    private _object: ObjectModel;
    private _events: ObjectEventService;
    private _lastUpdated: Date;

    constructor(object: ObjectModel, events: ObjectEventService) {
        this._object = object;
        this._events = events;
        this._lastUpdated = new Date();
    }

    get object(): ObjectModel {
        this._lastUpdated = new Date();
        return this._object;
    }
    get events(): ObjectEventService {
        this._lastUpdated = new Date();
        return this._events;
    }
    get lastUpdated(): Date {
        return this._lastUpdated;
    }

    updateObject(object: ObjectModel): void {
        let id = this._object.id;
        this._object = object;
        this._object.id = id;
        this._lastUpdated = new Date();
    }

    async validateAndFix(): Promise<void> {
        let errors = [];
        // Validate parent
        if (this._object.parentId) {
            let parent = await db.objects.findOne({ id: this._object.parentId });
            if (!parent) {
                errors.push(`Object ${this._object.id} has invalid parent ${this._object.parentId}. Parent set to null`);
                this._object.parentId = null;
            }
        }

        // Validate children
        if (this._object.children && this._object.children.length > 0) {
            for (let child of this._object.children) {
                let childObject = await db.objects.findOne({ id: child });
                if (!childObject) {
                    errors.push(`Object ${this._object.id} has invalid child ${child}. Child removed`);
                    this._object.children.splice(this._object.children.indexOf(child), 1);
                }
            }
        }

        // Validate properties
        if (this._object.properties.length > 0) {
            for (let prop of this._object.properties) {
                if (prop.key == undefined || prop.key.length === 0) {
                    errors.push(`Object ${this._object.id} has invalid property ${prop.key}. Key is null or empty. Property removed`);
                    this._object.properties.splice(this._object.properties.indexOf(prop), 1);
                    continue;
                }
                if (prop.value == undefined) {
                    errors.push(`Object ${this._object.id} has invalid property ${prop.key}. Value is null. Value set to empty string`);
                    prop.value = "";
                }
                if (prop.mqttProperty == undefined) {
                    errors.push(`Object ${this._object.id} has invalid property ${prop.key}. MqttProperty is null. MqttProperty set to default`);
                    prop.mqttProperty = {
                        display: false,
                        subscribe: false,
                    };
                }
            }
        }

        if (errors.length > 0) {
            throw new Error(errors.join("\n\t"));
        }
    }
}

class ObjectStorage extends Service<ObjectEventType | ScriptTargetEvent> {

    public get name(): string {
        return "ObjectStorage";
    }

    private logger = new Logger(this.name);
    private _saveDelay: number = 1000 * 10;
    private _saveInterval: NodeJS.Timeout | undefined;

    private _publishObjectsDelay: number = 1000 * 5;
    private _publishObjectsInterval: NodeJS.Timeout | undefined;

    private updatedObjects = new Set<string>();

    get saveDelay(): number {
        return this._saveDelay;
    }

    set saveDelay(value: number) {
        this.logger.debug(`Save delay changed from ${this._saveDelay} to ${value}`);
        this._saveDelay = value;
        if (this._saveInterval) {
            clearTimeout(this._saveInterval);
            this._saveInterval = undefined;
        }
        if (this.running) {
            this._saveInterval = setInterval(() => {
                this.save();
            }, this._saveDelay);
        }
    }

    private constructor() {
        super();
    }

    private static _instance: ObjectStorage;
    public static get instance(): ObjectStorage {
        return this._instance || (this._instance = new this());
    }

    private objects: StoredObject[] = [];

    get count(): number {
        return this.objects.length;
    }

    public start(): Promise<void> {
        if (this.running)
            return Promise.resolve();
        return new Promise<void>(async (resolve, reject) => {
            // Start save interval
            this._saveInterval = setInterval(async () => {
                if(this.running == false){
                    return;
                }
                await this.save();
            }, this._saveDelay);

            // Start publish interval
            this._publishObjectsInterval = setInterval(() => {
                if(this.running == false){
                    return;
                }
                this.publishObjects();
            }, this._publishObjectsDelay);

            
            this.running = true;
            this.emit("started");
            resolve();
        });
    }

    public stop(): Promise<void> {
        if (!this.running)
            return Promise.resolve();
        return new Promise<void>(async (resolve, reject) => {
            this.running = false;
            this.emit("stopped");
            // Stop save interval
            if (this._saveInterval) {
                clearTimeout(this._saveInterval);
                this._saveInterval = undefined;
            }
            await this.save();
            // Stop publish interval
            if (this._publishObjectsInterval) {
                clearTimeout(this._publishObjectsInterval);
                this._publishObjectsInterval = undefined;
            }

            this.clearCache();

            resolve();
        });
    }

    async add(object: ObjectModel): Promise<boolean> {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't add object ${object.id}`);
            return false;
        }
        if (this.objects.find(o => o.object.id === object.id))
            return false;
        this.logger.debug(`Adding object ${object.id}`);
        // Push object to array
        this.objects.push(new StoredObject(object, new ObjectEventService()));
        // Save object to database
        await db.objects.insertOne(object);
        if (config.mqtt.enabled) {
            this.logger.debug(`MQTT enabled, publishing object ${object.id}`);
            for (let prop of object.properties) {
                if (!prop.mqttProperty.display)
                    continue;
                // Publish property value to get topic
                this.logger.debug(`Publishing property ${prop.key} to get topic`);
                mqtt.publish(`Homium/objects/${object.id}/properties/${prop.key}/get`, prop.value);
                if (prop.mqttProperty.subscribe) {
                    // Publish property value to set topic
                    mqtt.publish(`Homium/objects/${object.id}/properties/${prop.key}/set`, prop.value);
                    // Subscribe to set topic
                    this.logger.debug(`Subscribing to set topic (Homium/objects/${object.id}/properties/${prop.key}/set)`)
                    mqtt.subscribe(`Homium/objects/${object.id}/properties/${prop.key}/set`, (topic: string, message: string) => {
                        // Call update function
                        this.updateObject(object!.id, prop.key, message);
                    });
                }
            }
        }
        this.emit("objectAdded", object);
        return true;
    }

    async get(id: string): Promise<ObjectModel | undefined> {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't get object ${id}`);
            return undefined;
        }
        let object = this.objects.find((o) => o.object.id === id);
        // if object is not in memory, try to get it from database
        if (!object) {
            let objFromDb = await db.objects.findOne({ id: id });
            if (!objFromDb) {
                this.logger.warn(`Object ${id} not found`);
                return undefined;
            }
            // Push object to array
            this.objects.push(new StoredObject(objFromDb, new ObjectEventService()));
            if (config.mqtt.enabled) {
                for (let prop of objFromDb.properties) {
                    if (!prop.mqttProperty.display)
                        continue;
                    // Publish property value to get topic
                    this.logger.debug(`Publishing property ${prop.key} to get topic`);
                    mqtt.publish(`Homium/objects/${objFromDb.id}/properties/${prop.key}/get`, prop.value);
                    if (prop.mqttProperty.subscribe) {
                        // Publish property value to set topic
                        mqtt.publish(`Homium/objects/${objFromDb.id}/properties/${prop.key}/set`, prop.value);
                        // Subscribe to set topic
                        this.logger.debug(`Subscribing to set topic (Homium/objects/${objFromDb.id}/properties/${prop.key}/set)`)
                        mqtt.subscribe(`Homium/objects/${objFromDb.id}/properties/${prop.key}/set`, (topic: string, message: string) => {
                            // Call update function
                            this._updateObject(objFromDb!.id, prop.key, message, false);
                        });
                    }
                }
            }
            this.emit('loaded', objFromDb);
            return objFromDb;
        }
        this.emit('loaded', object.object);
        return object.object;
    }

    async remove(id: string): Promise<boolean> {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't remove object ${id}`);
            return false;
        }
        // Try getting object from memory
        const index = this.objects.findIndex((o) => o.object.id === id);
        if (index > -1) {
            // Alert listeners
            this.objects[index].events.dispatchEvent('remove', this.objects[index].object);
            var objectRemoved = this.objects[index].object;
            // Remove object from memory
            this.objects.splice(index, 1);

            // Remove object from database
            await db.objects.deleteOne({ id: id });

            // Remove children from parent object
            let objects = await db.objects.find({ children: id }).toArray();
            for (let obj of objects) {
                const indexInRAMStorage = this.objects.findIndex((o) => o.object.id === obj.id);
                if (indexInRAMStorage > -1) {
                    this.objects[indexInRAMStorage].object.children = this.objects[indexInRAMStorage].object.children.filter((c: string) => c !== id);
                }
                obj.children = obj.children.filter((c: string) => c !== id);
                await db.objects.updateOne({ id: obj.id }, { $set: { children: obj.children } });
            }

            if (config.mqtt.enabled) {
                // Unsubscribe from all set topics
                mqtt.unsubscribe(`Homium/objects/${id}/#`);
            }
            this.emit('objectRemoved', objectRemoved);
            return true;
        }
        this.logger.warn(`Object ${id} not found`);
        return false;
    }

    async setChildren(parentId: string, childrenIds: string[]): Promise<boolean> {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't set children for object ${parentId}`);
            return false;
        }
        let parent = await this.get(parentId);
        if (!parent) {
            this.logger.warn(`Parent object ${parentId} not found`);
            return false;
        }
        // Add children to parent object
        for (let childId of childrenIds) {
            let child = await this.get(childId);
            if (!child) {
                this.logger.warn(`Child object ${childId} not found`);
                this.logger.warn(`Skipping child object ${childId}`);
                const index = parent.children.indexOf(childId);
                if (index > -1) {
                    parent.children.splice(index, 1);
                }
                continue;
            }
            if (parent.children.find(c => c === childId)) {
                continue;
            }
            parent.children.push(childId);
        }

        // Remove children from parent object
        for (let childId of parent.children) {
            if (childrenIds.find(c => c === childId)) {
                continue;
            }
            parent.children.splice(parent.children.indexOf(childId), 1);
        }

        // Update parent object in database
        await db.objects.updateOne({ id: parentId }, { $set: { children: parent.children } });
        return true;
    }

    // update object structure
    async update(id: string, object: ObjectModel): Promise<boolean> {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't update object ${id}`);
            return false;
        }
        let obj = await this.get(id);
        if (!obj) {
            this.logger.warn(`Object ${id} not found`);
            return false;
        }
        object.id = id;
        object.updatedAt = Date.now();
        await db.objects.updateOne({ id: id }, {
            $set: { ...object }
        });
        const index = this.objects.findIndex((o) => o.object.id === id);
        if (index > -1) {
            this.logger.debug(`Object ${id} found in memory, updating`);
            // Alert listeners
            this.objects[index].events.dispatchEvent('update', this.objects[index].object);
            // Update object in memory
            this.objects[index].updateObject(object);
        }
        this.emit('objectUpdated', object);
        return true;
    }

    // update object property
    updateObject(id: string, prop: string, value: any): boolean {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't update object ${id}`);
            return false;
        }
        return this._updateObject(id, prop, value, true);
    }

    async reload(id: string) {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't reload object ${id}`);
            return;
        }
        let object = await db.objects.findOne({ id: id });
        if (!object) {
            this.logger.warn(`Object ${id} not found`);
            return;
        }
        // Try getting object from memory
        const index = this.objects.findIndex((o) => o.object.id === id);
        let events: Map<string, Array<Function>> = new Map();
        if (index > -1) {
            // Alert listeners
            this.objects[index].events.dispatchEvent('reload', this.objects[index].object);
            events = this.objects[index].events.list;
            // Remove object from memory
            this.objects.splice(index, 1);
        }
        await this.get(id);
        let obj = this.objects.find(o => o.object.id === id);
        events.forEach((funcs, key) => {
            funcs.forEach(func => {
                obj?.events.addEventListener(key, func);
            });
        });
    }

    async any(id: string): Promise<boolean> {
        if(this.running == false){
            this.logger.warn(`Service is not running, can't check if object ${id} exists`);
            return false;
        }
        let obj = await this.get(id);
        return obj !== undefined;
    }

    clearCache(): void {
        this.logger.debug('Clearing object cache');
        this.logger.debug(`Objects in cache: ${this.objects.length}`);
        this.emit('clearCache');
        this.objects = [];
    }

    private _updateObject(id: string, prop: string, value: any, publishToMqtt: boolean): boolean {
        // Try getting object from memory
        const index = this.objects.findIndex((o) => o.object.id === id);
        if (index > -1) {
            this.logger.debug(`Updating property ${prop} of object ${id} from ${this.objects[index].object.properties.find(p => p.key === prop)!.value} to ${value}`);
            value = convertAnyToCorrectType(value, this.objects[index].object.properties.find(p => p.key === prop)!.value);
            // Alert listeners
            const propIndex = this.objects[index].object.properties.findIndex(p => p.key === prop);
            if (propIndex > -1) {
                this.objects[index].object.properties[propIndex].value = value;
                this.objects[index].events.dispatchEvent('update', this.objects[index].object);
                this.objects[index].events.dispatchEvent('propertyUpdate', this.objects[index].object, prop, value);
                if (config.mqtt.enabled && publishToMqtt) {
                    // If property is displayed, publish value to get topic
                    if (this.objects[index].object.properties.find(p => p.key === prop)?.mqttProperty.display) {
                        mqtt.publish(`Homium/objects/${id}/properties/${prop}/get`, value);
                    }
                }
                // Added object to updated objects array
                this.updatedObjects.add(id);
                this.emit('propertyUpdated', this.objects[index].object, prop, value);
                return true;
            } else {
                this.logger.warn(`Property ${prop} not found on object ${id}`);
            }
        } else {
            // If object is not in memory, unsubscribe from set topic
            if (config.mqtt.enabled)
                mqtt.unsubscribe(`Homium/objects/${id}/properties/${prop}/set`);
        }
        return false;
    }

    addEventListener(id: string, eventType: ObjectEventType | ScriptTargetEvent, callback: UpdateEvent | PropertyUpdateEvent | Function | ((args: ScriptArgument) => void)): boolean {
        const object = this.objects.find((o) => o.object.id === id);
        if (object) {
            object.events.addEventListener(eventType, callback);
            return true;
        }
        return false;
    }

    removeEventListener(id: string, eventType: ObjectEventType | ScriptTargetEvent, callback: Function): boolean {
        const object = this.objects.find((o) => o.object.id === id);
        if (object) {
            object.events.removeEventListener(eventType, callback);
            return true;
        }
        return false;
    }

    private publishObjects() {
        // if mqtt is disabled, return
        if (!config.mqtt.enabled)
            return;
        this.emit('publishObjects');
        this.objects.forEach((o) => {
            this.emit('publishObject', o.object);
            // Loop through properties
            o.object.properties.forEach((p) => {
                // If property is not displayed, return
                if (!p.mqttProperty.display)
                    return;
                this.emit('publishProperty', o.object, p.key, p.value);
                // Publish value to get topic
                mqtt.publish(`Homium/objects/${o.object.id}/properties/${p.key}/get`, p.value);
            });
        });
    }

    private async save() {
        // If objects are not changed, return
        if (this.updatedObjects.size == 0) {
            return;
        }
        this.logger.debug('Saving objects...');
        this.emit('save');
        // Loop through updated objects
        for (let id of this.updatedObjects) {
            let object = this.objects.find((o) => o.object.id === id);
            if (object) {
                // Validate object before saving
                try {
                    await object.validateAndFix();
                } catch (err) {
                    this.logger.warn(`Object ${id} is not valid: ${err}`);
                    this.logger.info(`Object ${id} fixed. Saving...`);
                    this.emit("warning", id, err);
                }
                this.emit('saveObject', object.object);
                // Update object in database
                await db.objects.updateOne({ id: object.object.id }, {
                    $set: {
                        properties: object.object.properties,
                        description: object.object.description,
                        name: object.object.name,
                        parentId: object.object.parentId,
                        allowAnonymous: object.object.allowAnonymous,
                        systemObject: object.object.systemObject,
                        children: object.object.children,
                        updatedAt: Date.now()
                    }
                });

            }
            // Remove object from updated objects array
            this.updatedObjects.delete(id);
        }
        this.logger.debug('Saving objects done!');
    }
}

export default ObjectStorage.instance;