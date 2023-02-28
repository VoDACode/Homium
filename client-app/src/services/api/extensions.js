import { BaseApi } from './base';

export class ApiExtensions {
    static async getExtensions() {
        return await BaseApi.getTextOrJson(await BaseApi.get('extensions'));
    }

    static async getExtension(id) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`extensions/${id}`))
    }

    static async getExtensionEvents(id) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`extensions/${id}/events`));
    }
}