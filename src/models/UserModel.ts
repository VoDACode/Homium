export class UserModel {
    lastname: string;
    firstname: string;
    username: string;
    password: string;
    expiresAt: Date = new Date();
    constructor(username: string, password: string, firstname: string | undefined = undefined, lastname: string | undefined = undefined) {
        this.username = username;
        this.password = password;
        this.firstname = firstname || "";
        this.lastname = lastname || "";
    }
}