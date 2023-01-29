import { IExtension } from "../../../types/IExtension";
import { TelegramUser } from "../models/TelegramUser";

export class UserService{
    private _extension: IExtension;

    constructor(extension: IExtension){
        this._extension = extension;
    }

    public add(user: TelegramUser): void {
        this._extension.storage.add("users", user);
    }

    public async get(id: number): Promise<TelegramUser | undefined> {
        return (await this._extension.storage.get("users")).find((x: any) => x.id == id);
    }

    public async remove(id: number): Promise<void> {
        await this._extension.storage.remove("users", await this.findIndex(x => x.id == id));
    }

    public async update(id: number, data: any): Promise<void> {
        let user = await this.get(id) as any;
        if(user == undefined)
            return;
        await this._extension.storage.remove("users", await this.findIndex(x => x.id == id));
        
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key) && Object.prototype.hasOwnProperty.call(user, key) && user[key] != data[key] && key != "id") {
                user[key] = data[key];
            }
        }

        await this._extension.storage.add("users", user);
    }

    public async getAll(): Promise<TelegramUser[]> {
        return await this._extension.storage.get("users") as TelegramUser[] || [];
    }

    public async findIndex(predicate: (user: TelegramUser) => boolean): Promise<number> {
        return (await this.getAll()).findIndex(predicate);
    }

    public async find(predicate: (user: TelegramUser) => boolean): Promise<TelegramUser | undefined> {
        return (await this.getAll()).find(predicate);
    }
    
    public async has(predicate: (user: TelegramUser) => boolean): Promise<boolean> {
        return (await this.findIndex(predicate)) != -1;
    }
}