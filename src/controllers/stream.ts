import express from 'express';
import config from '../config';
import { getUser } from '../guards/AuthGuard';
import { getPropertyToJsonObject, ObjectModel } from '../models/ObjectModel';
import ObjectStorage from '../services/ObjectService';

const router = express.Router();

router.ws('/object-update/:id', async (ws, req) => {
    const id = req.params.id;
    const object = await ObjectStorage.get(id);
    if (!object) {
        ws.send(JSON.stringify({ error: 'Object not found' }));
        ws.close();
        return;
    }

    if (!config.DEBUG.debug && !config.DEBUG.allowAnonymous) {
        const user = await getUser(req);
        if (!object.allowAnonymous && !user) {
            ws.close();
            return;
        }
    }

    ObjectStorage.addEventListener(id, 'update', sendObject);

    ws.on('close', () => {
        ObjectStorage.removeEventListener(id, 'update', sendObject);
    });

    function sendObject(newObject: ObjectModel) {
        if (ws.readyState >= ws.CLOSING) {
            ObjectStorage.removeEventListener(id, 'update', sendObject);
        }
        ws.send(JSON.stringify(getPropertyToJsonObject(newObject)));
    }
});

router.ws('/object-update/:id/:prop', async (ws, req) => {
    const id = req.params.id;
    const prop = req.params.prop;
    const object = await ObjectStorage.get(id);
    if (!object || !object.properties.find(p => p.key === prop)) {
        ws.send(JSON.stringify({ error: 'Object not found' }));
        ws.close();
        return;
    }

    if (!config.DEBUG.debug && !config.DEBUG.allowAnonymous) {
        const user = await getUser(req);
        if (!object.allowAnonymous && !user) {
            ws.close();
            return;
        }
    }

    ObjectStorage.addEventListener(id, 'propertyUpdate', sendObject);

    ws.on('close', () => {
        ObjectStorage.removeEventListener(id, 'propertyUpdate', sendObject);
    });

    function sendObject(newObject: ObjectModel, property: string, value: any) {
        if (property !== prop) {
            return;
        }
        if (ws.readyState >= ws.CLOSING) {
            ObjectStorage.removeEventListener(id, 'propertyUpdate', sendObject);
        }
        ws.send(value);
    }
});

module.exports = router;
module.exports.IN_ROOT = true;