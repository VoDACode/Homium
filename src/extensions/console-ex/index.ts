import { IExtension } from "../../types/IExtension";

module.exports = class ConsoleEx implements IExtension {
    public name: string = "ConsoleEx";

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