import { BaseApi } from "./base";

export class ApiAuth{
    static async signIn(username: string, password: string) {
        return await BaseApi.post("auth/signin", { username, password });
    }

    static async signOut() {
        return await BaseApi.post("auth/signout", {}, { ignoreAuth: true });
    }

    static async refresh() {
        return await BaseApi.post("auth/refresh");
    }

    static async status() {
        return await BaseApi.get("auth/status");
    }
}