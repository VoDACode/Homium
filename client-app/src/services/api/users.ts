import { BaseApi } from "./base";

export class ApiUsers{
    static async getUsers() {
        return await BaseApi.getTextOrJson(await BaseApi.get("users/list"));
    }

    static async getSelfUser() {
        return await BaseApi.getTextOrJson(await BaseApi.get("users/list/self"));
    }

    static async getSelfPermissions() {
        return await BaseApi.getTextOrJson(await BaseApi.get("users/list/self/permissions"));
    }

    static async getUser(username: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`users/list/${username}`));
    }

    static async getUserPermissions(username: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`users/list/${username}/permissions`));
    }

    static async createUser(user: any) {
        return await BaseApi.post("users/list", user);
    }

    static async updateUser(user: any) {
        return await BaseApi.put(`users/list/${user.username}`, user);
    }

    static async deleteUser(username: string) {
        return await BaseApi.delete(`users/list/${username}`);
    }
}
