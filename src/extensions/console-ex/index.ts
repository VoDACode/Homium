import { IExtension } from "../../types/IExtension";

module.exports = class ConsoleEx implements IExtension {
    public name: string = "ConsoleEx";
    public description: string = "ConsoleEx extension";
    public version: string = "1.0.0";

    constructor() {
        console.log("ConsoleEx extension loaded");
    }
    
    public stop(): void {
        console.log("ConsoleEx extension stopped");
    }

    public run(): void {
        console.log("ConsoleEx extension running");
    }
}