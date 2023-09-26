import * as express from "express";
import { authGuard, hasPermission } from 'homium-lib/utils/auth-guard';
import { serviceManager, IExtensionsService } from "homium-lib/services";

const router = express.Router();

router.get("/", authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.extensions.read) == false) {
        res.status(403).send("Permission denied").end();
        return;
    }

    const extensions = serviceManager.get(IExtensionsService);

    let list: any = extensions.allInfo;
    for (let i = 0; i < list.length; i++) {
        delete list[i]["_id"];
        delete list[i].storage;
        list[i].urls = {
            static: `${req.headers.host}/extensions/${list[i].id}/static/`,
            api: `${req.headers.host}/extensions/${list[i].id}/api/`
        };
    }
    res.send(list).status(200).end();
});

router.get("/:id", authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.extensions.read) == false) {
        res.status(403).send("Permission denied").end();
        return;
    }

    let id = req.params.id;
    const extensions = serviceManager.get(IExtensionsService);
    let info: any = extensions.allInfo.find(e => e.id == id);
    if (!info) {
        res.status(404).send("Extension not found").end();
        return;
    }
    
    delete info["_id"];
    delete info.storage;
    info.urls = {
        static: `${req.headers.host}/extensions/${info.id}/static/`,
        api: `${req.headers.host}/extensions/${info.id}/api/`
    };

    res.send(info).status(200).end();
});

router.get("/:id/events", authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.extensions.read) == false) {
        res.status(403).send("Permission denied").end();
        return;
    }

    let id = req.params.id;
    const extensions = serviceManager.get(IExtensionsService);
    let extension = extensions.get(id, 'id');
    if (!extension) {
        res.status(404).send("Extension not found").end();
        return;
    }

    res.send(extension.events).status(200).end();
});

module.exports = router;