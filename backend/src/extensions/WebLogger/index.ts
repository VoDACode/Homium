import { Extension } from "homium-lib/extension";

class WebLogger extends Extension{
    globalName: string = "WebLogger";
    name: string = "WebLogger";
    start(): void {
        
    }
    stop(): void {
        
    }
    public static get instance(): WebLogger {
        return this._getOriginal(__dirname);
    }
}

export default WebLogger;
module.exports = WebLogger;