import express from 'express';
import { uuid } from 'uuidv4';
import { authGuard, getPermissions, getUser } from 'homium-lib/utils/auth-guard';
import crypto from 'crypto';
import { fetch } from 'cross-fetch';
import { serviceManager, IDatabaseService } from 'homium-lib/services';
import { BotModel, BotViewModel } from 'homium-lib/models/bot.model';
import { UserModel } from 'homium-lib/models';
import { ClientPermissions } from 'homium-lib/models/permission.model';


const router = express.Router();
const API_KEY_LENGTH = 128;
const OATH2_KEY_LENGTH = 256;

let oauth2Keys: Map<string, { createdAt: Date, callback: (code: string, error: string | null) => void, ip: string, event: string }> = new Map();

router.get('/list', authGuard, async (req, res) => {
    const userPermissions = await getPermissions(req);
    if (userPermissions?.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }
    const db = serviceManager.get(IDatabaseService);
    res.send(await db.bots.find({}).map((bot) => new BotViewModel(bot)).toArray());
});

router.get('/list/:id', authGuard, async (req, res) => {
    const userPermissions = await getPermissions(req);
    if (userPermissions?.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }
    const db = serviceManager.get(IDatabaseService);
    let bot = await db.bots.findOne({ id: req.params.id });
    if (!bot) {
        res.status(404).send("Bot not found!");
        return;
    }
    res.send(new BotViewModel(bot));
});

router.post('/create', authGuard, async (req, res) => {
    const user = await getUser(req);
    if (user?.permissions.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }

    const db = serviceManager.get(IDatabaseService);

    const name = req.body.name;
    const description = req.body.description || "";
    const isActivated = req.body.isActivated || true;
    const permissions = req.body.permissions;

    let id = "";
    let apiKey = "";

    if (name == undefined) {
        res.status(400).send("Missing required name field!");
        return;
    } else if (name.length > 50 || name.length < 3) {
        res.status(400).send("Name must be between 3 and 50 characters!");
        return;
    } else if (UserModel.RESERVED_USERNAMES.includes(name)) {
        res.status(400).send("Name is reserved!");
        return;
    } else if (description.length > 500) {
        res.status(400).send("Description must be less than 500 characters!");
        return;
    } else if (permissions == undefined) {
        res.status(400).send("Missing required permissions field!");
        return;
    } else if (typeof permissions !== 'object') {
        res.status(400).send("Permissions must be an object!");
        return;
    }

    do {
        id = uuid();
    } while (await db.bots.countDocuments({ id: id }) > 0);

    do {
        apiKey = crypto.randomBytes(Math.ceil(API_KEY_LENGTH / 2))
            .toString('hex')
            .slice(0, API_KEY_LENGTH);
    } while (await db.bots.countDocuments({ apiKey: apiKey }) > 0);

    permissions.isAdministrator = false;
    let bot = new BotModel(id, name, description, apiKey, isActivated, permissions);

    // user can`t create user with higher permissions
    for (const key in permissions) {
        if (Object.prototype.hasOwnProperty.call(permissions, key) && typeof (permissions as any)[key] === 'object') {
            if (!validatePermissions(permissions, user, p => (p as any)[key])) {
                res.status(401).send('Permission denied!').end();
                return;
            }
        }
    }

    await db.bots.insertOne(bot);

    res.send(new BotViewModel(bot)).status(201);
});

router.get('/getApiKey/:id', authGuard, async (req, res) => {
    const userPermissions = await getUser(req);
    if (userPermissions?.permissions.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }
    const db = serviceManager.get(IDatabaseService);
    let bot = await db.bots.findOne({ id: req.params.id });
    if (!bot) {
        res.status(404).send("Bot not found!");
        return;
    }
    res.send(bot.apiKey);
});

router.put('/regenerate/:id', authGuard, async (req, res) => {
    const userPermissions = await getUser(req);
    if (userPermissions?.permissions.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }
    const db = serviceManager.get(IDatabaseService);
    let bot = await db.bots.findOne({ id: req.params.id });
    if (!bot) {
        res.status(404).send("Bot not found!");
        return;
    }

    do {
        bot.apiKey = crypto.randomBytes(Math.ceil(API_KEY_LENGTH / 2))
            .toString('hex')
            .slice(0, API_KEY_LENGTH);
    } while (await db.bots.countDocuments({ apiKey: bot.apiKey }) > 0);

    await db.bots.updateOne({ id: req.params.id }, { $set: { apiKey: bot.apiKey } });

    res.send(bot.apiKey).status(201);
});

router.put('/update', authGuard, async (req, res) => {
    const user = await getUser(req);
    if (user?.permissions.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }

    const db = serviceManager.get(IDatabaseService);

    const id: string | undefined = req.body.id;
    const name: string | undefined = req.body.name;
    const description: string = req.body.description ?? "";
    const isActivated: boolean | undefined = req.body.isActivated;
    const permissions: ClientPermissions | undefined = req.body.permissions;

    let bot = await db.bots.findOne({ id: id });
    if (!bot) {
        res.status(404).send("Bot not found!");
        return;
    }

    if (name && name !== bot.name && name.length > 3 && UserModel.RESERVED_USERNAMES.includes(name) === false) {
        bot.name = name;
    }

    if (description && description !== bot.description) {
        bot.description = description;
    }

    if (isActivated !== undefined && isActivated !== bot.isActivated) {
        bot.isActivated = isActivated;
    }

    if (permissions) {
        permissions.isAdministrator = false;
        // user can`t create user with higher permissions
        for (const key in permissions) {
            if (Object.prototype.hasOwnProperty.call(permissions, key) && typeof (permissions as any)[key] === 'object') {
                if (!validatePermissions(permissions, user, p => (p as any)[key])) {
                    res.status(401).send('Permission denied!').end();
                    return;
                }
            }
        }
    }
    await db.bots.updateOne({ id: id }, {
        $set:
        {
            name: bot.name,
            description: bot.description,
            isActivated: bot.isActivated,
            permissions: permissions
        }
    })

    res.send(new BotViewModel(bot)).status(201);
});

router.delete('/delete', authGuard, async (req, res) => {
    const userPermissions = await getUser(req);
    if (userPermissions?.permissions.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }
    const id: string | undefined = req.body.id;
    if (id == undefined) {
        res.status(400).send("Missing required id field!");
        return;
    }

    const db = serviceManager.get(IDatabaseService);

    let bot = await db.bots.findOne({ id: id });
    if (!bot) {
        res.status(404).send("Bot not found!");
        return;
    }

    await db.bots.deleteOne({ id: id });

    res.send(bot.id).status(200);
});

/*
    client -> server
    server -> bot
    bot -> server
    server -> bot & client
*/
router.get('/oath2/token', authGuard, async (req, res) => {
    let botIp: string = req.query.ip as string;
    let event = req.query.event as string;
    let key = crypto.randomBytes(Math.ceil(OATH2_KEY_LENGTH / 2))
        .toString('hex')
        .slice(0, OATH2_KEY_LENGTH);
    fetch(`http://${botIp}/api/oath2?event=${event}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: key,
    }).then(async (response) => {
        if (response.ok) {
            const callback = (code: string, error: string | null) => {
                if (error) {
                    res.send({
                        message: error,
                        success: false
                    }).status(400);
                } else {
                    res.send({
                        code: code,
                        success: true
                    }).status(200);
                }
                oauth2Keys.delete(key);
            };
            oauth2Keys.set(key, {
                ip: botIp,
                createdAt: new Date(),
                callback: callback,
                event: event
            });
            setTimeout(() => {
                if (oauth2Keys.has(key)) {
                    callback("", "Timeout");
                }
            }, 15000);
        } else {
            res.send({
                message: await response.json(),
                success: false
            }).status(400);
        }
    });
});

router.get('/oath2/verify', authGuard, async (req, res) => {
    let key: string = req.query.code as string;
    let event = req.query.event as string;

    if (!key || !event) {
        res.send({
            message: "Missing required fields",
            success: false
        }).status(400);
        return;
    }

    let oauth2Key = oauth2Keys.get(key);
    if (oauth2Key !== undefined && oauth2Key.event === event) {
        let code = crypto.randomBytes(Math.ceil(OATH2_KEY_LENGTH / 2))
            .toString('hex')
            .slice(0, OATH2_KEY_LENGTH);
        oauth2Key.callback(code, null);
        res.send({
            code: code,
            success: true
        }).status(200);
    } else {
        res.send({
            message: "Key not found",
            success: false
        }).status(404);
    }
});

function validatePermissions(permissions: ClientPermissions, user: UserModel | BotModel, getKey: (p: ClientPermissions) => any): boolean {
    for (const key in getKey(permissions)) {
        if (Object.prototype.hasOwnProperty.call(getKey(permissions), key)) {
            const element = getKey(permissions)[key];
            if (typeof element !== 'boolean' || (element === true && (getKey(user.permissions) as any)[key] === false)) {
                return false;
            }
        }
    }
    return true;
}

module.exports = router;
module.exports.ROUTER = "bot";