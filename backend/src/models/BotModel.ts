import { ClientPermissions } from "./ClientPermissions";

export class BotModel{
    public createdAt: Date;
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public apiKey: string,
        public isActivated: boolean,
        public permissions: ClientPermissions,
    ){
        this.createdAt = new Date();
    }
}

export class BotViewModel{
    public id: string;
    public name: string;
    public description: string;
    public isActivated: boolean;
    public permissions: ClientPermissions;
    public createdAt: Date;

    constructor(bot: BotModel){
        this.id = bot.id;
        this.name = bot.name;
        this.description = bot.description;
        this.isActivated = bot.isActivated;
        this.permissions = bot.permissions;
        this.createdAt = bot.createdAt;
    }

}