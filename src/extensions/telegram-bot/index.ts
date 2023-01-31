import { IExtension } from "../../types/IExtension";
import TelegramBot from "node-telegram-bot-api";
import { TelegramUser } from "./models/TelegramUser";
import { UserService } from "./services/UsersService";

class TelegramBotApp extends IExtension {
    private _bot: TelegramBot | null = null;
    public name: string = "telegram-bot";
    public globalName: string = "telegramBot";
    private _userService: UserService;

    get userService(): UserService {
        return this._userService;
    }

    get bot(): TelegramBot {
        if (this._bot == null)
            throw new Error("Telegram bot not started");
        return this._bot;
    }

    constructor(id: string) {
        super(id);
        this._userService = new UserService(this);
        this.addEventNames(["onmessage", "onnewuser", "callback_query"]);
    }

    public stop(): void {
    }

    public async start(): Promise<void> {
        if (this._bot != null)
            return;
        if (!(await this.storage.get("token"))) {
            this.logger.error("Telegram bot token not found");
            return;
        }
        this._bot = new TelegramBot(await this.storage.get("token"), { polling: true });
        this._bot.on("message", this.onMessage.bind(this));
        this._bot.on("callback_query", this.onCallbackQuery.bind(this));
        this._bot.on("polling_error", (err) => {
            this.logger.error("Telegram bot polling error: " + err);
        });
        this.logger.info("Telegram bot started");
    }

    public sendKeyboard(chatId: number, text: string, keyboard: TelegramBot.InlineKeyboardButton[][], options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message> {
        return this.bot.sendMessage(chatId, text, {
            reply_markup: {
                inline_keyboard: keyboard
            },
            ...options
        });
    }

    private async onMessage(msg: TelegramBot.Message): Promise<void> {
        if (await this.authUser(msg) == false)
            return;
        this.emit("onmessage", {
            msg: msg,
            bot: this.bot
        });
    }

    private async onCallbackQuery(query: TelegramBot.CallbackQuery): Promise<void> {
        if (await this.authUser(query) == false)
            return;
        this.emit("callback_query", {
            query: query,
            bot: this.bot
        });
    }

    private async authUser(data: TelegramBot.Message | TelegramBot.CallbackQuery): Promise<boolean> {
        if (!data.from)
            return false;
        if (await this.userService.has(x => x.id == data.from?.id) == false) {
            this.emit("onnewuser", {
                data: data,
                bot: this.bot
            });
            this.userService.add(new TelegramUser(data.from.id, data.from.first_name, data.from.last_name, data.from.username));
            return false;
        } else if ((await this.userService.find(x => x.id == data.from?.id))?.isAuthorized == false) {
            return false;
        }
        return true;
    }

    public static get instance(): TelegramBotApp {
        return this._getOriginal(__dirname);
    }
}

export default TelegramBotApp;
module.exports = TelegramBotApp;