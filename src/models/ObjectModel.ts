import { ObjectProperty } from "./ObjectProperty";

export class ObjectModel{
    public name: string;
    public parentId: string | null;
    public children: string[] = [];
    public id: string;
    public description: string | null;
    public properties: ObjectProperty[] = [];
    public allowAnonymous: boolean;
    public systemObject: boolean;
    public updatedAt: number = Date.now();
    
    constructor(name: string, parentId: string | null, id: string, description: string | null, object: ObjectProperty[], allowAnonymous: boolean = false, systemObject: boolean = false, updatedAt: number = Date.now()){
        this.name = name;
        this.parentId = parentId;
        this.id = id;
        this.description = description;
        this.properties = object;
        this.allowAnonymous = allowAnonymous;
        this.systemObject = systemObject;
        this.updatedAt = updatedAt;
    }
}

export function getPropertyToJsonObject(object: ObjectModel): any {
    let data: any = {};
    object.properties.forEach((prop) => {
        data = {...data, ...objectPropertyToJson(prop)};
    });
    return data;
}

export function objectPropertyToJson(prop: ObjectProperty): any {
    let data: any = {};
    data[prop.key] = prop.value;
    return data;
}