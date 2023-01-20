export abstract class IExtension{
    name: string = "";
    constructor() {
        console.log(`${this.name} extension loaded`);
    }
    abstract run(): void;
    abstract stop(): void;
}