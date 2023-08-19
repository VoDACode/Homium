import { BaseApi } from './base';

export class ApiObjects {
    static async getRootObjectIds() {
        return await BaseApi.getTextOrJson(await BaseApi.get('object/get-root'));
    }

    static async getLogicalObject(id: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}`));
    }

    static async getObject(id: string, viewProperties: boolean = false, viewType: string = '') {
        const viewObjectProps = viewProperties ? '?viewProperties=true' : '?viewProperties=';
        var viewObjectType = `&viewType=${viewType}`;
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/list/${id}${viewObjectProps}${viewObjectType}`));
    }

    static async getObjects(viewProperties: boolean = false, viewType: string = '') {
        const address = viewProperties ? 'controllers/object/list?viewProperties=true' : 'controllers/object/list?viewProperties=';
        var viewObjectType = viewType !== '' ? `?viewType=${viewType}` : '';
        return await BaseApi.getTextOrJson(await BaseApi.get(address + viewObjectType));
    }

    static async getObjectIds() {
        return await BaseApi.getTextOrJson(await BaseApi.get('controllers/object/list/ids'));
    }

    static async getChildrenIds(id: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}/children`));
    }

    static async getObjectsBySearch(substring?: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/search?query=${substring}`));
    }

    static async getPropHistory(id: string, prop: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}/${prop}/history`));
    }

    static async setProp(id: string, prop?: string, value?: string) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/set/${id}?key=${prop}&value=${value}`, { ignoreAuth: true }));
    }

    static async createObject(name: string, parentId: string | null, description: string | null, allowAnonymous: boolean, properties: any) {
        return await BaseApi.post('object/create', {
            name: name,
            parentId: parentId,
            description: description,
            allowAnonymous: allowAnonymous,
            properties: properties
        });
    }

    static async updateObject(id: string, name: string, description: string | null, allowAnonymous: boolean, parentId: string | null, children: any = undefined) {
        return await BaseApi.put(`object/update/${id}`, {
            name: name,
            description: description,
            allowAnonymous: allowAnonymous,
            parentId: parentId,
            children: children
        });
    }

    static async updateLogicalObject(id: string, properties: any) {
        return await BaseApi.put(`object/update/${id}/object`, properties);
    }

    static async removeObject(id: string) {
        return await BaseApi.delete(`object/remove/${id}`);
    }
}