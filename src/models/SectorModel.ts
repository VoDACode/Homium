import { SectionModel } from "./SectionModel";

export class SectorModel {
    name: string;
    description: string;
    sectorType: string;
    sections: SectionModel[];
    aliases: string[] = []; 
    isDefault: boolean = false;

    constructor(name: string, description: string, sectorType: string, sections: SectionModel[]) {
        this.name = name;
        this.description = description;
        this.sections = sections;
        this.sectorType = sectorType;
    }
}