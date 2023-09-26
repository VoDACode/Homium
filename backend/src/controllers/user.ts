import { exec } from 'child_process';
import express from 'express';
import { authGuard, getBot, getPermissions, getUser, hasPermission } from 'homium-lib/utils/auth-guard';
import { serviceManager, IDatabaseService } from 'homium-lib/services';
import { UserModel, UserView } from 'homium-lib/models/user.model';
import { ClientPermissions, PermissionTemplate } from 'homium-lib/models/permission.model';

const router = express.Router();

router.get('/list/', authGuard, async (req, res) => {
    if (await hasPermission(req, (p) => p.user.read) !== true) {
        res.status(403).send('Permission denied!');
        return;
    }

    const db = serviceManager.get(IDatabaseService);

    let users = await db.users.find({}).toArray();
    res.json(users.map(user => new UserView(user)));
});

router.get('/list/:username', authGuard, async (req, res) => {
    if (await hasPermission(req, (p) => p.user.read) !== true) {
        res.status(403).send('Permission denied!');
        return;
    }
    if (!req.params.username) {
        res.status(400).send('Invalid request').end();
        return;
    }

    const db = serviceManager.get(IDatabaseService);

    const username = req.params.username;
    const user = username == 'self' ? await getUser(req) : (await db.users.findOne({ username: username }));
    if (!user) {
        res.status(404).end();
        return;
    }
    res.json(new UserView(user));
});

router.get('/list/:username/permissions', authGuard, async (req, res) => {
    if (await hasPermission(req, (p) => p.user.read) !== true) {
        res.status(403).send('Permission denied!');
        return;
    }
    if (!req.params.username) {
        res.status(400).send('Invalid request').end();
        return;
    }
    if (req.params.username != 'self' && (await getUser(req))?.permissions.user.read !== true) {
        res.status(403).send('Permission denied!');
        return;
    }
    const username = req.params.username;

    const db = serviceManager.get(IDatabaseService);

    const permissions = username == 'self' ? await getPermissions(req) : (await db.users.findOne({ username: username }))?.permissions;
    if (!permissions) {
        res.status(401).end();
        return;
    }
    res.json(permissions);
});

router.post('/list/', authGuard, async (req, res) => {
    const clientPermissions = await getPermissions(req);
    if (clientPermissions?.user.create !== true) {
        res.status(403).send('Permission denied!');
        return;
    }
    const username: string = req.body.username;
    const password: string = req.body.password;
    const lastname: string | undefined = req.body.lastname;
    const firstname: string | undefined = req.body.firstname;
    const email: string | undefined = req.body.email;
    const enabled: boolean = req.body.enabled ?? true;
    const permissionTemplate: PermissionTemplate = req.body.permissionTemplate ?? 'guest';
    const permissions: ClientPermissions = req.body.permissions ?? UserModel.getTemplatePermissions(permissionTemplate);

    let newUser = new UserModel(username, password, firstname, lastname, permissions, enabled);
    newUser.email = email ?? undefined;

    if (!username || !password) {
        res.status(400).send('Invalid request').end();
        return;
    }

    if (username.length < 3 || username.length > 20) {
        res.status(400).send('Username must be between 3 and 20 characters').end();
        return;
    }

    if (password.length < 8 || password.length > 512) {
        res.status(400).send('Password must be between 8 and 512 characters').end();
        return;
    }

    if (permissions.isAdministrator && !clientPermissions?.isAdministrator) {
        res.status(401).send('Permission denied!').end();
        return;
    }

    // user can`t create user with higher permissions
    for (const key in permissions) {
        if (Object.prototype.hasOwnProperty.call(permissions, key) && typeof (permissions as any)[key] === 'object') {
            if (!validatePermissions(permissions, clientPermissions, p => (p as any)[key])) {
                res.status(401).send('Permission denied!').end();
                return;
            }
        }
    }

    const db = serviceManager.get(IDatabaseService);

    if (await db.users.countDocuments({ username: username }) > 0) {
        res.status(400).send('Username already exists').end();
        return;
    }

    await db.users.insertOne(newUser);
    res.status(201).end();
});

router.put('/list/:username', authGuard, async (req, res) => {
    if (!req.params.username) {
        res.status(400).send('Invalid request').end();
        return;
    }
    const username = req.params.username;
    let clientPermissions = await getPermissions(req);
    if (clientPermissions?.user.update !== true) {
        res.status(403).send('Permission denied!');
        return;
    }
    const password: string | undefined = req.body.password;
    const lastname: string | undefined = req.body.lastname;
    const firstname: string | undefined = req.body.firstname;
    const email: string | undefined = req.body.email;
    const enabled: boolean | undefined = req.body.enabled;
    const permissionTemplate: PermissionTemplate | undefined = req.body.permissionTemplate;
    const permissions: ClientPermissions | undefined = req.body.permissions;

    if (!password && !lastname && !firstname && !email && !enabled && !permissionTemplate && !permissions) {
        res.status(400).send('Invalid request').end();
        return;
    }

    const db = serviceManager.get(IDatabaseService);

    let user = await db.users.findOne({ username: username });

    if (!user) {
        res.status(404).send('User not found').end();
        return;
    }

    if (password && (password.length < 8 || password.length > 512)) {
        res.status(400).send('Password must be between 8 and 512 characters').end();
        return;
    } else {
        user.password = password ?? user.password;
        if (user.username == "root") {
            // change root password in linux user
            exec(`(echo '${user.password}'; echo '${user.password}') | passwd homium`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }
    }

    if (lastname && lastname.length > 50) {
        res.status(400).send('Lastname must be less than 50 characters').end();
        return;
    } else {
        user.lastname = lastname ?? user.lastname;
    }

    if (firstname && firstname.length > 50) {
        res.status(400).send('Firstname must be less than 50 characters').end();
        return;
    } else {
        user.firstname = firstname ?? user.firstname;
    }

    if (email && email.length > 120) {
        res.status(400).send('Email must be less than 120 characters').end();
        return;
    } else {
        user.email = email ?? user.email;
    }

    if (enabled !== undefined && typeof enabled !== 'boolean' && user.permissions.isAdministrator !== true) {
        user.enabled = enabled;
    }

    if (permissionTemplate && UserModel.getTemplatePermissions(permissionTemplate)) {
        user.permissions = UserModel.getTemplatePermissions(permissionTemplate);
    }

    if (permissions) {
        // user can`t create user with higher permissions
        for (const key in permissions) {
            if (Object.prototype.hasOwnProperty.call(permissions, key) && typeof (permissions as any)[key] === 'object') {
                if (!validatePermissions(permissions, clientPermissions, p => (p as any)[key])) {
                    res.status(401).send('Permission denied!').end();
                    return;
                }
            }
        }
        permissions.isAdministrator = user.permissions.isAdministrator;
        user.permissions = permissions;
    }

    await db.users.updateOne({ username: username }, { $set: user });

    res.status(200).end();
});

router.delete('/list/:username', authGuard, async (req, res) => {
    if (!req.params.username) {
        res.status(400).send('Invalid request').end();
        return;
    }
    const username = req.params.username;
    let user: any = await getUser(req) !== undefined ? await getUser(req) : await getBot(req);
    if (user?.permissions.user.remove !== true) {
        res.status(403).send('Permission denied!');
        return;
    }

    if (user.username !== undefined && username === user.username) {
        res.status(400).send('You can`t delete yourself').end();
        return;
    }

    const db = serviceManager.get(IDatabaseService);

    user = await db.users.findOne({ username: username });

    if (!user) {
        res.status(404).send('User not found').end();
        return;
    }

    if (user.permissions.isAdministrator) {
        res.status(401).send('Permission denied!').end();
        return;
    }

    await db.users.deleteOne({ username: username });

    res.status(200).end();
});

router.get('/templates', authGuard, async (req, res) => {
    let data = {
        'admin': UserModel.ADMIN_PERMISSIONS,
        'guest': UserModel.GUEST_PERMISSIONS,
        'controlPanel': UserModel.CONTROL_PANEL_PERMISSIONS,
        'userDevice': UserModel.USER_DEVICE_PERMISSIONS,
        'defaultUser': UserModel.CONTROL_PANEL_PERMISSIONS
    }
    res.status(200).send(data).end();
});

module.exports = router;
module.exports.ROUTER = 'users';

function validatePermissions(permissions: ClientPermissions, clientPermissions: ClientPermissions, getKey: (p: ClientPermissions) => any): boolean {
    for (const key in getKey(permissions)) {
        if (Object.prototype.hasOwnProperty.call(getKey(permissions), key)) {
            const element = getKey(permissions)[key];
            if (typeof element !== 'boolean' || (element === true && (getKey(clientPermissions) as any)[key] === false)) {
                return false;
            }
        }
    }
    return true;
}