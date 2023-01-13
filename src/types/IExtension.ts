export abstract class IExtension{
    name: string = "";
    description: string = "";
    version: string = "";
    constructor() {
        console.log(`${this.name} extension loaded`);
    }
    abstract run(): void;
    abstract stop(): void;
}