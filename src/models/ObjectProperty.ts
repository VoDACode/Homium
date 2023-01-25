import { ObjectModel } from "./ObjectModel";
import { ObjectPropertyHistory } from "./ObjectPropertyHistory";

export type MqttProperty = {
    display: boolean;
    subscribe: boolean;
}

export class ObjectProperty {
    value: any;
    history: ObjectPropertyHistory[];
    key: string;
    canHaveHistory: boolean;
    historyLimit: number = 50;

    mqttProperty: MqttProperty = {
        display: true,
        subscribe: true,
    };

    get hasHistory(): boolean {
        return this.history.length > 0;
    }

    constructor(key: string, value: any, canHaveHistory: boolean, history: ObjectPropertyHistory[] = [], mqttProperty?: MqttProperty) {
        this.key = key;
        this.value = value;
        this.canHaveHistory = canHaveHistory;
        this.history = history;
        this.mqttProperty = mqttProperty || { display: false, subscribe: false };
    }
}

export function pushObjectPropertyHistory(object: ObjectModel, key: string, value: any): boolean {
    let prop = object.properties.find((o) => o.key === key);
    if (!prop) {
        return false;
    }

    if(prop.canHaveHistory == false){
        return false;
    }

    if (prop.history.length >= prop.historyLimit) {
        prop.history.shift();
    }
    prop.history.push(new ObjectPropertyHistory(prop.value, new Date()));
    prop.value = value;
    return true;
}

export function convertAnyToCorrectType(value: any, inputVal: string): any | undefined {
    let newVal:any = value;
    if(typeof inputVal === 'number')
        newVal = parseFloat(value);
    else if(typeof inputVal === 'boolean')
        newVal = value === 'true';
    else if(typeof inputVal === 'string')
        newVal = value;
    if(Number.isNaN(newVal))
        return undefined;
    return newVal;
}