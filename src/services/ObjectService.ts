import { ObjectModel } from "../models/ObjectModel";
import { ObjectEventType } from "../types/ObjectEventType";
import db from "../db";
import mqtt from "./MqttService";
import { convertAnyToCorrectType } from "../models/ObjectProperty";
import config from "../config";

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

    private _publishObjectsDelay: number = 1000 * 5;
    private _publishObjectsInterval: NodeJS.Timeout | undefined;

    private updatedObjects = new Set<string>();

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
        this._saveInterval = setInterval(async () => {
            await this.save();
        }, this._saveDelay);
        this._publishObjectsInterval = setInterval(() => {
            this.publishObjects();
        }, this._publishObjectsDelay);
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
        // Push object to array
        this.objects.push(new StoredObject(object, new ObjectEventService()));
        // Save object to database
        await db.objects.insertOne(object);
        if (config.mqtt.enabled) {
            for (let prop of object.properties) {
                if (!prop.mqttProperty.display)
                    continue;
                // Publish property value to get topic
                mqtt.publish(`Homium/objects/${object.id}/properties/${prop.key}/get`, prop.value);
                if (prop.mqttProperty.subscribe) {
                    // Publish property value to set topic
                    mqtt.publish(`Homium/objects/${object.id}/properties/${prop.key}/set`, prop.value);
                    // Subscribe to set topic
                    mqtt.subscribe(`Homium/objects/${object.id}/properties/${prop.key}/set`, (topic: string, message: string) => {
                        // Call update function
                        this.update(object!.id, prop.key, message);
                    });
                }
            }
        }
        return true;
    }

    async get(id: string): Promise<ObjectModel | undefined> {
        let object = this.objects.find((o) => o.object.id === id);
        // if object is not in memory, try to get it from database
        if (!object) {
            let objFromDb = await db.objects.findOne({ id: id });
            if (!objFromDb) {
                return undefined;
            }
            // Push object to array
            this.objects.push(new StoredObject(objFromDb, new ObjectEventService()));
            if (config.mqtt.enabled) {
                for (let prop of objFromDb.properties) {
                    if (!prop.mqttProperty.display)
                        continue;
                    // Publish property value to get topic
                    mqtt.publish(`Homium/objects/${objFromDb.id}/properties/${prop.key}/get`, prop.value);
                    if (prop.mqttProperty.subscribe) {
                        // Publish property value to set topic
                        mqtt.publish(`Homium/objects/${objFromDb.id}/properties/${prop.key}/set`, prop.value);
                        // Subscribe to set topic
                        mqtt.subscribe(`Homium/objects/${objFromDb.id}/properties/${prop.key}/set`, (topic: string, message: string) => {
                            // Call update function
                            this._update(objFromDb!.id, prop.key, message, false);
                        });
                    }
                }
            }
            return objFromDb;
        }
        return object.object;
    }

    async remove(id: string): Promise<boolean> {
        // Try getting object from memory
        const index = this.objects.findIndex((o) => o.object.id === id);
        if (index > -1) {
            // Alert listeners
            this.objects[index].events.dispatchEvent('remove', this.objects[index].object);
            // Remove object from memory
            this.objects.splice(index, 1);
            // Remove object from database
            await db.objects.deleteOne({ id: id });
            if (config.mqtt.enabled) {
                // Unsubscribe from all set topics
                mqtt.unsubscribe(`Homium/objects/${id}/#`);
            }
            return true;
        }
        return false;
    }

    update(id: string, prop: string, value: any): boolean {
        return this._update(id, prop, value, true);
    }

    private _update(id: string, prop: string, value: any, publishToMqtt: boolean): boolean {
        // Try getting object from memory
        const index = this.objects.findIndex((o) => o.object.id === id);
        if (index > -1) {
            value = convertAnyToCorrectType(value, this.objects[index].object.properties.find(p => p.key === prop)!.value);
            // Alert listeners
            this.objects[index].events.dispatchEvent('update', this.objects[index].object);
            this.objects[index].events.dispatchEvent('propertyUpdate', this.objects[index].object, prop, value);
            if (config.mqtt.enabled && publishToMqtt) {
                // If property is displayed, publish value to get topic
                if (this.objects[index].object.properties.find(p => p.key === prop)?.mqttProperty.display)
                    mqtt.publish(`Homium/objects/${id}/properties/${prop}/get`, value);
            }
            // Added object to updated objects array
            this.updatedObjects.add(id);
            return true;
        }else{
            // If object is not in memory, unsubscribe from set topic
            if(config.mqtt.enabled)
                mqtt.unsubscribe(`Homium/objects/${id}/properties/${prop}/set`);
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

    private publishObjects() {
        // if mqtt is disabled, return
        if (!config.mqtt.enabled)
            return;
        this.objects.forEach((o) => {
            // Loop through properties
            o.object.properties.forEach((p) => {
                // If property is not displayed, return
                if (!p.mqttProperty.display)
                    return;
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
        console.log('Saving objects...');
        // Loop through updated objects
        for(let id of this.updatedObjects){
            let object = this.objects.find((o) => o.object.id === id);
            if(object){
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
        console.log('Objects saved.');
    }
}

export default ObjectStorage.instance;