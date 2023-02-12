import { DeviceModel } from "./DeviceModel";

export class SectionModel {
    name: string;
    description: string;
    aliases: string[] = [];
    devices: DeviceModel[] = [];

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description; 
    }
} 