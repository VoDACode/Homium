import { BaseApi } from './base';

export class ApiObjects {
    static async getRootObjects() {
        return await BaseApi.getTextOrJson(await BaseApi.get('object/get-root'));
    }

    static async getObject(id) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}`));
    }
    
    static async getObjects(viewProperties = false) {
        const address = viewProperties ? 'controllers/object/list?viewProperties=true' : 'controllers/object/list';
        return await BaseApi.getTextOrJson(await BaseApi.get(address));
    }

    static async getObjectsIds() {
        return await BaseApi.getTextOrJson(await BaseApi.get('controllers/object/list/ids'));
    }

    static async getChildren(id) {
        return await BaseApi.getTextOrJson(await BaseApi.get(`object/get/${id}/children`));
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
            object: properties
        });
    }

    static async removeObject(id) {
        return await BaseApi.delete(`object/remove/${id}`);
    }

    static async updateObject(id, name, description, allowAnonymous) {
        return await BaseApi.post(`object/update/${id}`, {
            name: name,
            description: description,
            allowAnonymous: allowAnonymous
        });
    }

    static async updateObjectProperties(id, properties) {
        return await BaseApi.post(`object/update/${id}/object`, properties);
    }

    static async updateObjectParent(id, parentId) {
        return await BaseApi.post(`object/update/${id}/parent`, {
            parentId: parentId
        });
    }

    static async updateObjectChildren(id, children) {
        return await BaseApi.post(`object/update/${id}/children`, {
            children: children
        });
    }
}