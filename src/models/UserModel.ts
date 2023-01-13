export class UserModel {
    username: string;
    password: string;
    expiresAt: Date = new Date();
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}