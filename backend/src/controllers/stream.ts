import express from 'express';
import { isAuthorized } from 'homium-lib/utils/auth-guard';
import { serviceManager, IConfigService, IObjectService } from 'homium-lib/services';
import { ObjectModel } from 'homium-lib/models';
import { getPropertyToJsonObject } from 'homium-lib/utils';

const router = express.Router();

router.ws('/object-update/:id', async (ws, req) => {
    const id = req.params.id;

    const objectService = serviceManager.get(IObjectService);
    const configService = serviceManager.get(IConfigService);

    const object = await objectService.get(id);
    if (!object) {
        ws.send(JSON.stringify({ error: 'Object not found' }));
        ws.close();
        return;
    }

    if (!configService.config.DEBUG.debug && !configService.config.DEBUG.allowAnonymous) {
        if (!object.allowAnonymous && !await isAuthorized(req)) {
            ws.close();
            return;
        }
    }

    objectService.addEventListener(id, 'update', sendObject);
    objectService.addEventListener(id, 'remove', onremove);

    function onremove() {
        ws.send(JSON.stringify({ error: 'Object removed' }));
        ws.close();
        objectService.removeEventListener(id, 'update', sendObject);
        objectService.removeEventListener(id, 'remove', onremove);
    }

    ws.on('close', () => {
        objectService.removeEventListener(id, 'update', sendObject);
        objectService.removeEventListener(id, 'remove', onremove);
    });

    function sendObject(newObject: ObjectModel) {
        if (ws.readyState >= ws.CLOSING) {
            objectService.removeEventListener(id, 'update', sendObject);
        }
        ws.send(JSON.stringify(getPropertyToJsonObject(newObject)));
    }
});

router.ws('/object-update/:id/:prop', async (ws, req) => {
    const id = req.params.id;
    const prop = req.params.prop;

    const objectService = serviceManager.get(IObjectService);
    const configService = serviceManager.get(IConfigService);

    const object = await objectService.get(id);
    if (!object || !object.properties.find(p => p.key === prop)) {
        ws.send(JSON.stringify({ error: 'Object not found' }));
        ws.close();
        return;
    }

    if (!configService.config.DEBUG.debug && !configService.config.DEBUG.allowAnonymous) {
        if (!object.allowAnonymous && !await isAuthorized(req)) {
            ws.close();
            return;
        }
    }

    objectService.addEventListener(id, 'propertyUpdate', sendObject);
    objectService.addEventListener(id, 'remove', onremove);

    function onremove() {
        ws.send(JSON.stringify({ error: 'Object removed' }));
        ws.close();
        objectService.removeEventListener(id, 'propertyUpdate', sendObject);
        objectService.removeEventListener(id, 'remove', onremove);
    }

    ws.on('close', () => {
        objectService.removeEventListener(id, 'propertyUpdate', sendObject);
        objectService.removeEventListener(id, 'remove', onremove);
    });

    function sendObject(newObject: ObjectModel, property: string, value: any) {
        if (property !== prop) {
            return;
        }
        if (ws.readyState >= ws.CLOSING) {
            objectService.removeEventListener(id, 'propertyUpdate', sendObject);
        }
        ws.send(value);
    }
});

module.exports = router;
module.exports.IN_ROOT = true;