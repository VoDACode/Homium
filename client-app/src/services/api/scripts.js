import { BaseApi } from "./base";

export class ApiScripts {
    static async getScriptsId() {
        return await BaseApi.getTextOrJson(await BaseApi.get("scripts"));
    }

    static async getScripts(ids) {
        var res = [];

        for (var i = 0; i < ids.length; i++) {
            res.push(await this.getScript(ids[i]));
        }

        return res;
    }

    static async getScript(id) {
        return await BaseApi.getTextOrJson( await BaseApi.get(`scripts/${id}`));
    }
}