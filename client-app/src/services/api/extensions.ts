import { BaseApi } from './base';

export class ApiExtensions {
    static async getExtensions() {
        return await BaseApi.getTextOrJson(await BaseApi.get('extensions'));
    }

    static async getExtension(id: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`extensions/${id}`))
    }

    static async getExtensionEvents(id: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`extensions/${id}/events`));
    }
}