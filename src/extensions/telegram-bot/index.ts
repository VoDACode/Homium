import { IExtension } from "../../types/IExtension";
import TelegramBot from "node-telegram-bot-api";
import { TelegramUser } from "./models/TelegramUser";
import { UserService } from "./services/UsersService";

class TelegramBotApp extends IExtension {
    private _bot: TelegramBot | null = null;
    public name: string = "telegram-bot";
    private _userService: UserService;

    get userService(): UserService {
        return this._userService;
    }

    get bot(): TelegramBot {
        if(this._bot == null)
            throw new Error("Telegram bot not started");
        return this._bot;
    }

    constructor(id: string) {
        super(id);
        this._userService = new UserService(this);
    }
    
    public stop(): void {
    }

    public async start(): Promise<void> {
        if(this._bot != null) 
            return;
        if(!(await this.storage.get("token"))){
            this.logger.error("Telegram bot token not found");
            return;
        }
        this._bot = new TelegramBot(await this.storage.get("token"), {polling: true});
        this._bot.on("message", this.onMessage.bind(this));
        this.context.bot = this._bot;
        this.logger.info("Telegram bot started");
    }

    private async onMessage(msg: TelegramBot.Message): Promise<void> {
        if(!msg.from)
            return;
        if(await this.userService.has(x => x.id == msg.from?.id) == false) {
            this.userService.add(new TelegramUser(msg.from.id, msg.from.first_name, msg.from.last_name, msg.from.username));
            return;
        }else if((await this.userService.find(x => x.id == msg.from?.id))?.isAuthorized == false) {
            return;
        }
        this.logger.debug("Message from " + msg.from.first_name + " " + msg.from.last_name + " (" + msg.from.username + "): " + msg.text);
    }

    public static get instance(): TelegramBotApp {
        return this._getOriginal(__dirname);
    }
}

export default TelegramBotApp;
module.exports = TelegramBotApp;