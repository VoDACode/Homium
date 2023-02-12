import { SectorModel } from "../models/SectorModel";
import db from "../db";
import { SectionModel } from "../models/SectionModel";
import { DeviceModel } from "../models/DeviceModel";
import ObjectService from "./ObjectService";
import { ObjectModel } from "../models/ObjectModel";

class SectorService {
    private static _instance: SectorService;
    private _initialized: boolean = false;
    public static get instance(): SectorService {
        if (!this._instance) {
            this._instance = new SectorService();
        }
        return this._instance;
    }

    private constructor() { }

    private _sectors: SectorModel[] = [];

    async init() {
        if (this._initialized) {
            return;
        }
        this._sectors = await db.sectors.find().toArray();
        this._initialized = true;
    }

    public sector = {
        get: this.getSector.bind(this),
        list: () => this._sectors,
        add: this.addSector.bind(this),
        remove: this.removeSector.bind(this),
        update: this.updateSector.bind(this)
    };

    public sections = {
        get: this.getSection.bind(this),
        list: this.getSections.bind(this),
        add: this.addSection.bind(this),
        remove: this.removeSection.bind(this),
        update: this.updateSection.bind(this)
    };

    public devices = {
        get: this.getDevice.bind(this),
        list: this.getDevices.bind(this),
        add: this.addDevice.bind(this),
        remove: this.removeDevice.bind(this),
        update: this.updateDevice.bind(this),
        setProperty: this.setDeviceProperty.bind(this)
    };

    // #region Sectors
    private getSector(sectorName: string): SectorModel {
        const sector = this._sectors.find(s => s.name === sectorName);
        if (!sector) {
            throw new Error(`Sector ${sectorName} not found`);
        }
        return sector;
    }

    private addSector(sector: SectorModel) {
        if (this._sectors.find(s => s.name === sector.name)) {
            throw new Error(`Sector ${sector.name} already exists`);
        }
        if(sector.isDefault == true) {
            this._sectors.forEach(s => s.isDefault = false);
        }
        this._sectors.push(sector);
        db.sectors.insertOne(sector);
    }

    private removeSector(sectorName: string) {
        const sectorIndex = this._sectors.findIndex(s => s.name === sectorName);
        if (sectorIndex === -1) {
            throw new Error(`Sector ${sectorName} not found`);
        }
        this._sectors.splice(sectorIndex, 1);
        db.sectors.deleteOne({ name: sectorName });
    }

    private updateSector(sector: SectorModel) {
        const sectorIndex = this._sectors.findIndex(s => s.name === sector.name);
        if (sectorIndex === -1) {
            throw new Error(`Sector ${sector.name} not found`);
        }
        this._sectors[sectorIndex] = sector;
        db.sectors.deleteOne({ name: sector.name }).then(() => {
            db.sectors.insertOne(sector);
        });
    }
    //#endregion

    //#region Sections
    private getSections(sectorName: string): SectionModel[] {
        return this.sector.get(sectorName).sections;
    }

    private getSection(sectorName: string, sectionName: string): SectionModel {
        const section = this.sections.list(sectorName).find(s => s.name === sectionName);
        if (!section) {
            throw new Error(`Section ${sectionName} not found`);
        }
        return section;
    }

    private addSection(sectorName: string, section: SectionModel) {
        const sector = this.sector.get(sectorName);
        if (sector.sections.find(s => s.name === section.name)) {
            throw new Error(`Section ${section.name} already exists`);
        }
        sector.sections.push(section);
        db.sectors.updateOne({ name: sectorName }, { $push: { sections: section } });
    }

    private removeSection(sectorName: string, sectionName: string) {
        const sector = this.sector.get(sectorName);
        const sectionIndex = sector.sections.findIndex(s => s.name === sectionName);
        if (sectionIndex === -1) {
            throw new Error(`Section ${sectionName} not found`);
        }
        sector.sections.splice(sectionIndex, 1);
        db.sectors.updateOne({ name: sectorName }, { $pull: { sections: { name: sectionName } } });
    }

    private updateSection(sectorName: string, section: SectionModel) {
        const sector = this.sector.get(sectorName);
        const sectionIndex = sector.sections.findIndex(s => s.name === section.name);
        if (sectionIndex === -1) {
            throw new Error(`Section ${section.name} not found`);
        }
        sector.sections[sectionIndex] = section;
        db.sectors.updateOne({ name: sectorName }, { $pull: { sections: { name: section.name } } }).then(() => {
            db.sectors.updateOne({ name: sectorName }, { $push: { sections: section } });
        });
    }
    //#endregion

    // #region Devices

    private getDevice(sectorName: string, sectionName: string, deviceName: string): DeviceModel {
        const device = this.devices.list(sectorName, sectionName).find(d => d.name === deviceName);
        if (!device) {
            throw new Error(`Device ${deviceName} not found`);
        }
        return device;
    }

    private getDevices(sectorName: string, sectionName: string): DeviceModel[] {
        const section = this.sections.get(sectorName, sectionName);
        return section.devices;
    }

    private addDevice(sectorName: string, sectionName: string, device: DeviceModel) {
        const section = this.sections.get(sectorName, sectionName);
        if (section.devices.find(d => d.name === device.name)) {
            throw new Error(`Device ${device.name} already exists`);
        }
        section.devices.push(device);
        db.sectors.updateOne({ name: sectorName, "sections.name": sectionName }, { $push: { "sections.$.devices": device } });
    }

    private removeDevice(sectorName: string, sectionName: string, deviceName: string) {
        const deviceIndex = this.devices.list(sectorName, sectionName).findIndex(d => d.name === deviceName);
        if (deviceIndex === -1) {
            throw new Error(`Device ${deviceName} not found`);
        }
        this.devices.list(sectorName, sectionName).splice(deviceIndex, 1);
        db.sectors.updateOne({ name: sectorName, "sections.name": sectionName }, { $pull: { "sections.$.devices": { name: deviceName } } });
    }

    private updateDevice(sectorName: string, sectionName: string, device: DeviceModel) {
        const deviceIndex = this.devices.list(sectorName, sectionName).findIndex(d => d.name === device.name);
        if (deviceIndex === -1) {
            throw new Error(`Device ${device.name} not found`);
        }
        this.devices.list(sectorName, sectionName)[deviceIndex] = device;
        db.sectors.updateOne({ name: sectorName, "sections.name": sectionName }, { $pull: { "sections.$.devices": { name: device.name } } }).then(() => {
            db.sectors.updateOne({ name: sectorName, "sections.name": sectionName }, { $push: { "sections.$.devices": device } });
        });
    }

    private setDeviceProperty(sectorName: string, sectionName: string, deviceName: string, propertyName: string, propertyValue: any) {
        const device = this.devices.get(sectorName, sectionName, deviceName);
        let obj = device.properties.find(p => p.name === propertyName);
        if (!obj) {
            throw new Error(`Property ${propertyName} not found`);
        }
        if(!ObjectService.update(obj.objectId, obj.objectProperty, propertyValue)){
            throw new Error(`Property ${propertyName} not found`);
        }
    }



    //#endregion
}

export default SectorService.instance;