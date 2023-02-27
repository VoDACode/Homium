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

    static async createScript(script) {
        return await BaseApi.post("scripts", script);
    }

    static async updateScript(id, script) {
        return await BaseApi.put(`scripts/${id}`, script);
    }

    static async updateScriptCode(id, code) {
        return await BaseApi.put(`scripts/${id}/code`, code);
    }

    static async deleteScript(id) {
        return await BaseApi.delete(`scripts/${id}`);
    }

    static async executeScript(id) {
        return await BaseApi.get(`scripts/${id}/execute`);
    }
}