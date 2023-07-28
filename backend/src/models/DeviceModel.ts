export class DeviceProperty{
    name: string;
    description: string = "";
    objectId: string;
    objectProperty: string;
    aliases: string[] = [];
    constructor(name: string, objectId: string, objectProperty: string){
        this.name = name;
        this.objectId = objectId;
        this.objectProperty = objectProperty;
    }
}

export class DeviceModel{
    name: string;
    description: string;
    type: string;
    aliases: string[] = [];
    properties: DeviceProperty[] = [];
    constructor(name: string, description: string, type: string){
        this.name = name;
        this.description = description;
        this.type = type;
    }
}