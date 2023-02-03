import * as express from "express";
import { authGuard } from "../guards/AuthGuard";
import extensions from "../services/extensions";

const router = express.Router();

router.get("/", authGuard, (req, res) => {
    let list: any = extensions.allInfo;
    for(let i = 0; i < list.length; i++){
        delete list[i].storage;
        list[i].urls = {
            static: `${req.headers.host}/extensions/${list[i].id}/static/`,
            api: `${req.headers.host}/extensions/${list[i].id}/api/`
        };
    }
    res.send(list).status(200).end();
});

module.exports = router;