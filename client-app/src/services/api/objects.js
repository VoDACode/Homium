import { BaseApi } from './base';

export class ApiObjects {
    static async getRootObjectIds() {
        return await BaseApi.getTextOrJson(await BaseApi.get('object/get-root'));
    }

    static async getLogicalObject(id) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}`));
    }

    static async getObject(id, viewProperties = false, viewType = '') {
        const viewObjectProps = viewProperties ? '?viewProperties=true' : '?viewProperties=';
        var viewObjectType = `&viewType=${viewType}`;
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/list/${id}${viewObjectProps}${viewObjectType}`));
    }

    static async getObjects(viewProperties = false, viewType = '') {
        const address = viewProperties ? 'controllers/object/list?viewProperties=true' : 'controllers/object/list?viewProperties=';
        var viewObjectType = viewType !== '' ? `?viewType=${viewType}` : '';
        return await BaseApi.getTextOrJson(await BaseApi.get(address + viewObjectType));
    }

    static async getObjectIds() {
        return await BaseApi.getTextOrJson(await BaseApi.get('controllers/object/list/ids'));
    }

    static async getChildrenIds(id) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}/children`));
    }

    static async getObjectsBySearch(substring) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/search?query=${substring}`));
    }

    static async getPropHistory(id, prop) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}/${prop}/history`));
    }

    static async setProp(id, prop, value) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/set/${id}?key=${prop}&value=${value}`, { ignoreAuth: true }));
    }

    static async createObject(name, parentId, description, allowAnonymous, properties) {
        return await BaseApi.post('object/create', {
            name: name,
            parentId: parentId,
            description: description,
            allowAnonymous: allowAnonymous,
            properties: properties
        });
    }

    static async updateObject(id, name, description, allowAnonymous, parentId, children = undefined) {
        return await BaseApi.put(`object/update/${id}`, {
            name: name,
            description: description,
            allowAnonymous: allowAnonymous,
            parentId: parentId,
            children: children
        });
    }

    static async updateLogicalObject(id, properties) {
        return await BaseApi.put(`object/update/${id}/object`, properties);
    }

    static async removeObject(id) {
        return await BaseApi.delete(`object/remove/${id}`);
    }
}