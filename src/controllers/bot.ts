import express from 'express';
import { uuid } from 'uuidv4';
import db from '../db';
import { authGuard, getPermissions, getUser } from '../guards/AuthGuard';
import { BotModel, BotViewModel } from '../models/BotModel';
import crypto from 'crypto';
import { ClientPermissions } from '../models/ClientPermissions';
import { UserModel } from '../models/UserModel';

const router = express.Router();
const API_KEY_LENGTH = 128;

router.get('/list', authGuard, async (req, res) => {
    const userPermissions = await getPermissions(req);
    if (userPermissions?.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }
    res.send(await db.bots.find({}).map((bot) => new BotViewModel(bot)).toArray());
});

router.get('/list/:id', authGuard, async (req, res) => {
    const userPermissions = await getPermissions(req);
    if (userPermissions?.isAdministrator !== true) {
        res.status(403).send("Permission denied!");
        return;
    }
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

    let bot = await db.bots.findOne({ id: id });
    if (!bot) {
        res.status(404).send("Bot not found!");
        return;
    }

    await db.bots.deleteOne({ id: id });

    res.send(bot.id).status(200);
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