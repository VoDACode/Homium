import * as express from "express";
import { authGuard, hasPermission } from "../guards/AuthGuard";
import extensions from "../services/extensions";

const router = express.Router();

router.get("/", authGuard, (req, res) => {
    let list: any = extensions.allInfo;
    for (let i = 0; i < list.length; i++) {
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
    let info: any = extensions.allInfo.find(e => e.id == id);
    if (!info) {
        res.status(404).send("Extension not found").end();
        return;
    }

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
    let extension = extensions.get(id, 'id');
    if (!extension) {
        res.status(404).send("Extension not found").end();
        return;
    }

    res.send(extension.events).status(200).end();
});

module.exports = router;