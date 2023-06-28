export class Session {
    username: string;
    expiresAt: Date;
    sessionToken: string;
    createdAt: Date = new Date();
    constructor(username: string, expiresAt: Date, sessionToken: string) {
        this.username = username
        this.expiresAt = expiresAt
        this.sessionToken = sessionToken
    }

    isExpired() : boolean {
        return this.expiresAt < (new Date());
    }
}