import { ObjectModel } from "./ObjectModel";
import { ObjectPropertyHistory } from "./ObjectPropertyHistory";

export class ObjectProperty {
    value: any;
    history: ObjectPropertyHistory[];
    key: string;
    canHaveHistory: boolean;
    historyLimit: number = 50;

    get hasHistory(): boolean {
        return this.history.length > 0;
    }

    constructor(key: string, value: any, canHaveHistory: boolean, history: ObjectPropertyHistory[] = []) {
        this.key = key;
        this.value = value;
        this.canHaveHistory = canHaveHistory;
        this.history = history;
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