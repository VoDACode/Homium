export class TelegramUser {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;

    userId: number | null = null;
    isAuthorized: boolean = false;

    constructor(id: number, firstName: string, lastName?: string, username?: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
    }
}