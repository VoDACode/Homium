import express from 'express';
import { WithId } from 'mongodb';
import { uuid } from 'uuidv4';
import db from '../db';
import { authGuard, hasPermission, isAuthorized } from '../guards/AuthGuard';
import { getPropertyToJsonObject, ObjectModel, objectPropertyToJson } from '../models/ObjectModel';
import { ObjectProperty, pushObjectPropertyHistory } from '../models/ObjectProperty';
import ObjectService from '../services/ObjectService';

const router = express.Router();

router.post('/create', authGuard, async (req, res) => {
    const name: string = req.body.name;
    const parentId: string | null = req.body.parentId ?? null;
    const description: string | null = req.body.description;
    const properties = req.body.properties as ObjectProperty[];
    const allowAnonymous: boolean = req.body.allowAnonymous ?? false;

    if (await hasPermission(req, p => p.object.create) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    if (properties == null || !Array.isArray(properties))
        return res.status(400).send('The object must be an array.').end();

    for (let i = 0; i < properties.length; i++) {
        if (properties[i].key == undefined || typeof properties[i].key != 'string' || properties[i].value == undefined)
            return res.status(400).send('The object must be an array of objects with the properties "key" and "value".').end();
        else if (properties[i].canHaveHistory != null && typeof properties[i].canHaveHistory !== 'boolean')
            return res.status(400).send('The property "canHaveHistory" must be a boolean.').end();
        else if (properties[i].historyLimit != null && typeof properties[i].historyLimit !== 'number')
            return res.status(400).send('The property "historyLimit" must be a number.').end();
        else if (properties[i].historyLimit != null && properties[i].historyLimit < 0)
            return res.status(400).send('The property "historyLimit" must be a positive number.').end();

        if (properties[i].mqttProperty != null && typeof properties[i].mqttProperty !== 'object')
            return res.status(400).send('The property "mqttProperty" must be an object.').end();
        else if (properties[i].mqttProperty != null && typeof properties[i].mqttProperty.display !== 'boolean')
            return res.status(400).send('The property "mqttProperty.display" must be a boolean.').end();
        else if (properties[i].mqttProperty != null && typeof properties[i].mqttProperty.subscribe !== 'boolean')
            return res.status(400).send('The property "mqttProperty.subscribe" must be a boolean.').end();

        if (properties[i].mqttProperty.display != null)
            properties[i].mqttProperty.display = properties[i].mqttProperty.display ?? false;
        if (properties[i].mqttProperty.subscribe != null)
            properties[i].mqttProperty.subscribe = properties[i].mqttProperty.subscribe ?? false;

        properties[i].historyLimit = properties[i].historyLimit ?? 0;
        properties[i].canHaveHistory = properties[i].canHaveHistory ?? false;
        properties[i].history = [];
    }
    if (!name) {
        return res.status(400).send('The name must be a string.').end();
    }

    let obj = new ObjectModel(name, parentId, uuid(), description, properties, allowAnonymous);
    let parent: WithId<ObjectModel> | null = null;
    if (parentId != null) {
        parent = await db.objects.findOne({ id: parentId });
        if (parent == null) {
            return res.status(400).send('The parent object does not exist.').end();
        }
        let props = parent.properties;
        for (let i = 0; i < props.length; i++) {
            let newProp = new ObjectProperty(props[i].key, props[i].value, props[i].canHaveHistory, []);
            newProp.historyLimit = props[i].historyLimit;
            newProp.mqttProperty = props[i].mqttProperty;
            if (obj.properties.findIndex(p => p.key == newProp.key) != -1) {
                continue;
            }
            obj.properties.push(newProp);
        }
        parent.children.push(obj.id);
    }

    while (await db.objects.countDocuments({ id: obj.id }) > 0) {
        obj.id = uuid();
    }
    await ObjectService.add(obj);
    if (parent) {
        await ObjectService.setChildren(parent.id, parent.children);
    }
    res.status(201).send(obj.id).end();
});

router.delete('/remove/:id', authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.object.remove) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    const id = req.params.id;
    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }
    if (await db.objects.countDocuments({ id: id }) == 0) {
        return res.status(404).send('Object not found.').end();
    }
    let object = await db.objects.findOne({ id: id });
    if (object?.systemObject) {
        return res.status(403).send('This object is a system object and cannot be removed.').end();
    }

    remove(id).then(() => {
        res.status(200).send('Object removed.').end();
    });

    async function remove(id: string) {
        return db.objects.find({ parentId: id }).forEach((object: any) => {
            remove(object.id);
        }).then(async () => {
            await db.objects.deleteOne({ id: id });
        });
    }
});

router.put('/update/:id/object', authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.object.update) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    const id = req.params.id;
    const obj = req.body as ObjectProperty[];

    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }

    if (obj == null || !Array.isArray(obj)) {
        return res.status(400).send('The object must be an array.').end();
    }

    let object = await db.objects.findOne({ id: id });
    if (object == null) {
        return res.status(404).send('Object not found.').end();
    }
    if (!object.allowAnonymous && !isAuthorized(req)) {
        return res.status(401).send('You are not authorized to modify this object.').end();
    }
    if (object.systemObject) {
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }

    for (let i = 0; i < obj.length; i++) {
        if (!obj[i].key || !obj[i].value)
            return res.status(400).send('The object must be an array of objects with the properties "key" and "value".').end();
        else if (obj[i].canHaveHistory != null && typeof obj[i].canHaveHistory !== 'boolean')
            return res.status(400).send('The property "canHaveHistory" must be a boolean.').end();
        else if (obj[i].historyLimit != null && typeof obj[i].historyLimit !== 'number')
            return res.status(400).send('The property "historyLimit" must be a number.').end();
        else if (obj[i].historyLimit != null && obj[i].historyLimit < 0)
            return res.status(400).send('The property "historyLimit" must be a positive number.').end();

        obj[i].canHaveHistory = obj[i].canHaveHistory ?? false;

        if(object.properties.findIndex(p => p.key == obj[i].key) > -1) {
            obj[i].value = object.properties.find(p => p.key == obj[i].key)?.value ?? obj[i].value;
            if (obj[i].canHaveHistory) {
                obj[i].historyLimit = obj[i].historyLimit ?? 0;
                if (obj[i].historyLimit > 0) {
                    obj[i].history = object.properties.find(p => p.key == obj[i].key)?.history.slice(-obj[i].historyLimit) ?? [];
                }
            }
        }
        obj[i].history = obj[i].history ?? [];
        obj[i].historyLimit = obj[i].historyLimit ?? 0;
    }

    object.properties = obj;
    await ObjectService.update(id, object);

    // update properties for all children
    /*
        1 -> 2 -> 3
    */

    res.status(200).send('Object updated.').end();
});

router.put('/update/:id', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.object.update) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    const id = req.params.id as string;
    const name = req.body.name as string;
    const allowAnonymous = req.body.allowAnonymous as boolean;
    const description = req.body.description as string;
    const parentId = req.query.parentId as string;
    const children = req.query.children as string[];
    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }
    let object = await db.objects.findOne({ id: id });
    if (object == null) {
        return res.status(404).send('Object not found.').end();
    }
    if (object.systemObject) {
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }
    if (allowAnonymous != undefined && typeof allowAnonymous === 'boolean') {
        object.allowAnonymous = allowAnonymous;
    }
    if (name != undefined && typeof name === 'string') {
        if (name.length > 1) {
            object.name = name;
        } else {
            return res.status(400).send('The name must be at least 2 characters long.').end();
        }
    }
    if (description != undefined && typeof description === 'string') {
        object.description = description;
    }
    if (parentId != undefined && typeof parentId === 'string') {
        if (parentId == id) {
            return res.status(400).send('The parent id cannot be the same as the object id.').end();
        }
        if (await db.objects.countDocuments({ id: parentId }) == 0) {
            return res.status(404).send('Parent object not found.').end();
        }
        object.parentId = parentId;
    }
    if (children != undefined && Array.isArray(children)) {
        if (children.includes(id)) {
            return res.status(400).send('The children cannot contain the object id.').end();
        }
        for (let i = 0; i < children.length; i++) {
            if (typeof children[i] !== 'string') {
                return res.status(400).send('The children must be an array of strings.').end();
            }
            if (await db.objects.countDocuments({ id: children[i] }) == 0) {
                return res.status(404).send('Child object not found.').end();
            }
        }
        object.children = children;
    }
    await ObjectService.update(id, object);
    res.status(200).send('Object updated.').end();
});

router.get('/get/:id', async (req, res) => {
    const id = req.params.id;
    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }
    const object = await ObjectService.get(id);
    if (!object) {
        return res.status(404).send('Object not found.').end();
    }

    if (!object.allowAnonymous) {
        if (!await isAuthorized(req)) {
            return res.status(401).send('You are not authorized to view this object.').end();
        } else if (await hasPermission(req, p => p.object.read) !== true) {
            res.status(403).send('Permission denied!').end();
            return;
        }
    }

    res.status(200).send(getPropertyToJsonObject(object)).end();
});

router.get('/get/:id/children', async (req, res) => {
    const id = req.params.id;
    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }
    const object = await db.objects.findOne({ id: id });
    if (object == null) {
        return res.status(404).send('Object not found.').end();
    }

    if (!object.allowAnonymous) {
        if (!await isAuthorized(req)) {
            return res.status(401).send('You are not authorized to view this object.').end();
        } else if (await hasPermission(req, p => p.object.read) !== true) {
            res.status(403).send('Permission denied!').end();
            return;
        }
    }

    res.status(200).send(object.children).end();
});

router.get('/get/:id/:prop/history', async (req, res) => {
    const id = req.params.id;
    const prop = req.params.prop;

    if (prop == null || typeof prop !== 'string') {
        return res.status(400).send('The prop must be a string.').end();
    }

    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }
    const object = await ObjectService.get(id);
    if (object == null) {
        return res.status(404).send('Object not found.').end();
    }
    if (!object.allowAnonymous) {
        if (!await isAuthorized(req)) {
            return res.status(401).send('You are not authorized to view this object.').end();
        } else if (await hasPermission(req, p => p.object.read) !== true) {
            res.status(403).send('Permission denied!').end();
            return;
        }
    }
    const index = object.properties.findIndex(p => p.key === prop);
    if (index == -1) {
        return res.status(404).send('Property not found.').end();
    }
    res.status(200).send({
        current: object.properties[index].value,
        history: object.properties[index].history
    }).end();
});

router.get('/get-root', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.object.read) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    const object = await db.objects.find({ parentId: null }).toArray();
    if (object == null) {
        return res.status(404).send('Object not found.').end();
    }
    res.status(200).send(object.map(p => p.id)).end();
});

router.get('/set/:id', async (req, res) => {
    const id = req.params.id;
    let value: any = req.query.value;
    const key = req.query.key;
    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }
    if (!key || typeof key !== 'string') {
        return res.status(400).send('The key must be a string.').end();
    }
    if (!value) {
        return res.status(400).send('The value must not be NULL.').end();
    }

    if (typeof value != 'string' && typeof value != 'number' && typeof value != 'boolean') {
        return res.status(400).send('The value must be a string, number, or boolean.').end();
    }

    const object = await ObjectService.get(id);

    if (!object) {
        return res.status(404).send('Object not found.').end();
    }

    if (!object.allowAnonymous) {
        if (!await isAuthorized(req)) {
            return res.status(401).send('You are not authorized to modify this object.').end();
        } else if (await hasPermission(req, p => p.object.canUse) !== true) {
            res.status(403).send('Permission denied!').end();
            return;
        }
    }

    if (object.systemObject) {
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }

    let index = object.properties.findIndex(o => o.key == key);
    if (index == -1) {
        return res.status(404).send('Property not found.').end();
    }

    if (typeof object.properties[index].value == 'number') {
        value = Number(value);
    } else if (typeof object.properties[index].value == 'boolean') {
        value = value == 'true';
    }

    if (Number.isNaN(value)) {
        return res.status(400).send('The value must be a number.').end();
    }

    if (typeof value != typeof object.properties[index].value) {
        return res.status(400).send(`The value must be of the same type[${typeof object.properties[index].value}] as the current value.`).end();
    }

    pushObjectPropertyHistory(object, key, value);

    ObjectService.updateObject(id, key, value);

    res.status(200).json(objectPropertyToJson(object.properties[index])).end();
});

router.get('/list/ids', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.object.read) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    const objects = await db.objects.find().toArray();
    res.status(200).send(objects.map(p => p.id)).end();
});

router.get('/list', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.object.read) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    const viewProperties = req.query.viewProperties == 'true';
    const viewType = req.query.viewType;

    const objects = await db.objects.find().toArray();
    res.status(200).send(objects.map(p => {
        let obj: any = {
            id: p.id,
            name: p.name,
            parentId: p.parentId,
            description: p.description,
            updatedAt: p.updatedAt,
            allowAnonymous: p.allowAnonymous,
            children: p.children,
            systemObject: p.systemObject
        }
        if (viewProperties) {
            if (viewType == 'array') {
                obj.properties = p.properties.map(o => {
                    return {
                        key: o.key,
                        value: o.value,
                        canHaveHistory: o.canHaveHistory,
                        historyLimit: o.historyLimit,
                        mqttProperty: o.mqttProperty
                    }
                });
            } else {
                obj.properties = getPropertyToJsonObject(p);
            }
        }
        return obj;
    })).end();
});

router.get('/list/:id', authGuard, async (req, res) => {
    const id = req.params.id;
    if (id == null || typeof id !== 'string') {
        return res.status(400).send('The id must be a string.').end();
    }

    if (await hasPermission(req, p => p.object.read) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    const viewProperties = req.query.viewProperties == 'true';
    const viewType = req.query.viewType;

    const object = await ObjectService.get(id);
    if (object == null) {
        return res.status(404).send('Object not found.').end();
    }
    let obj: any = {
        id: object.id,
        name: object.name,
        parentId: object.parentId,
        description: object.description,
        updatedAt: object.updatedAt,
        allowAnonymous: object.allowAnonymous,
        children: object.children,
        systemObject: object.systemObject
    }
    if (viewProperties) {
        if (viewType == 'array') {
            obj.properties = object.properties.map(p => {
                return {
                    key: p.key,
                    value: p.value,
                    canHaveHistory: p.canHaveHistory,
                    historyLimit: p.historyLimit,
                    mqttProperty: p.mqttProperty
                }
            });
        } else {
            obj.properties = getPropertyToJsonObject(object);
        }
    }
    res.status(200).send(obj).end();
});

router.get('/search', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.object.read) !== true) {
        res.status(403).send('Permission denied!').end();
        return;
    }

    let query = req.query.query;

    if (query == null || typeof query !== 'string') {
        return res.status(400).send('The query must be a string.').end();
    }

    let objects = await db.objects.find({ name: { $regex: query, $options: 'i' } }).toArray();

    let results = await Promise.all(objects.map(async (p) => {
        let path = await getPath(p);
        return {
            id: p.id,
            name: p.name,
            path: path,
            parentId: p.parentId,
            description: p.description,
            updatedAt: p.updatedAt,
            allowAnonymous: p.allowAnonymous,
            children: p.children,
            systemObject: p.systemObject,
            properties: getPropertyToJsonObject(p)
        }
    }));

    res.status(200).send(results).end();

    async function getPath(obj: ObjectModel): Promise<any> {
        if (obj.parentId == null) {
            return [{
                id: obj.id,
                name: obj.name,
            }]
        }
        let parent = await db.objects.findOne({ id: obj.parentId });
        if (parent == null) {
            return [{
                id: obj.id,
                name: obj.name,
            }]
        }
        return [...await getPath(parent), {
            id: obj.id,
            name: obj.name,
        }]
    }
});

module.exports = router;
