import { exec } from 'child_process';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { IExtension } from './types/IExtension';
import extensions from './services/extensions';
import db from './db';
import { UserModel } from './models/UserModel';
import { MenuItem } from './models/MenuItem';
import { uuid } from 'uuidv4';
import { ExtensionModel } from './models/ExtensionModel';

const app = express();

export function bootExtensions() {
    return _bootExtensions('all');
}

export function bootNewExtensions() {
    return _bootExtensions('onlyNew');
}

export function loadControllers() {
    const controllersPath = path.join(__dirname, 'controllers');
    fs.readdirSync(controllersPath).forEach((file) => {
        if (file.endsWith('.map')) {
            return;
        }
        if (!file.endsWith('.ts') && !file.endsWith('.js') && fs.lstatSync(path.join(controllersPath, file)).isDirectory()) {
            return;
        }
        let controller = require(path.join(controllersPath, file));
        let name = file.replace(' ', '-').replace('.ts', '').replace('.js', '');
        if (controller.ROUTER) {
            name = controller.ROUTER;
        }
        app.use('/api/controllers/' + name, controller);
        console.log('Loaded controller: ' + name);
    });
    return app;
}

export async function firstStart() {
    if (await db.users.countDocuments() === 0) {
        await db.users.insertOne(new UserModel("root", "toor"));
    }
    if (await db.menu.countDocuments() === 0) {
        await db.menu.insertMany([
            new MenuItem("[HOME]", "", "", "/", [], "link"),
            new MenuItem("[EXTENSION_MARKET]", "", "", "/admin/extensions/market", [], "link"),
            new MenuItem("[EXTENSIONS]", "", "", "", [
                new MenuItem("[EXTENSIONS]", "", "", "/admin/extensions", [], "link"),
            ], "extentions"),
            new MenuItem("[OBJECTS]", "", "", "", [
                new MenuItem("[SYSTEM_OBJECTS]", "", "", "/admin/objects/system", [], "link"),
                new MenuItem("[DEVICES]", "", "", "/admin/objects/devices", [], "link"),
                new MenuItem("[SCRIPTS]", "", "", "/admin/objects/scripts", [], "link"),
            ], "page"),
            new MenuItem("[ADMINISTRATION]", "", "", "", [
                new MenuItem("[USERS]", "", "", "/admin/users", [], "link"),
                new MenuItem("[MENU]", "", "", "/admin/menu", [], "link"),
                new MenuItem("[SETTINGS]", "", "", "/admin/settings", [], "link"),
                new MenuItem("[LOGS]", "", "", "/admin/logs", [], "link"),
            ], 'plugin'),
        ]);
    }
}

function _bootExtensions(mode: 'onlyNew' | 'all') {
    const extensionsPath = path.join(__dirname, 'extensions');
    fs.readdirSync(extensionsPath).forEach(async (file) => {
        let isExist = false;
        let firstStart = false;
        if (!fs.lstatSync(path.join(extensionsPath, file)).isDirectory()) {
            return;
        }

        if (!fs.existsSync(path.join(extensionsPath, file, 'index.js'))) {
            return;
        }

        if (!fs.existsSync(path.join(extensionsPath, file, 'package.json'))) {
            return;
        }

        if (mode === 'onlyNew' && extensions.any(file, 'folder')) {
            return;
        }
        if (mode === 'all' && extensions.any(file, 'folder')) {
            extensions.get(file, 'folder')?.stop();
            isExist = true;
        }


        // get dependencies from package.json
        const packageJson = JSON.parse(fs.readFileSync(path.join(extensionsPath, file, 'package.json'), 'utf8'));
        if (!packageJson.dependencies || !packageJson.version) {
            return;
        }
        if (!packageJson.id || packageJson.id === "") {
            firstStart = true;
            do {
                packageJson.id = uuid();
            } while ((await db.extensions.countDocuments({ id: packageJson.id })) != 0);
            fs.writeFileSync(path.join(extensionsPath, file, 'package.json'), JSON.stringify(packageJson));
        }

        // check if dependencies are installed
        for (const dependency in packageJson.dependencies) {
            if (!fs.existsSync(path.join(extensionsPath, file, 'node_modules', dependency))) {
                exec(`npm install ${dependency}`, { cwd: __dirname }, (error, stdout, stderr) => {
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

        if (!isExist) {
            const extension: IExtension = new (require(path.join(extensionsPath, file)))();
            app.use('/extensions/' + extension.name + '/static', express.static(path.join(extensionsPath, file, 'static')));

            let apiRoutes = path.join(extensionsPath, file, 'routes');
            if (fs.existsSync(apiRoutes)) {
                let apiRoutesFiles = fs.readdirSync(apiRoutes);
                apiRoutesFiles.forEach((apiRouteFile) => {
                    if (apiRouteFile.endsWith('.map')) {
                        return;
                    }
                    if (!apiRouteFile.endsWith('.ts') && !apiRouteFile.endsWith('.js') && fs.lstatSync(path.join(apiRoutes, apiRouteFile)).isDirectory()) {
                        return;
                    }
                    let controller = require(path.join(extensionsPath, file, 'routes', apiRouteFile));
                    let name = file.replace(' ', '-').replace('.ts', '').replace('.js', '');
                    if (controller.ROUTER) {
                        name = controller.ROUTER;
                    }
                    console.log('Adding route: ' + '/extensions/' + extension.name + '/api/' + name);
                    app.use('/extensions/' + extension.name + '/api/' + name, controller);
                });
            }
            let menu = await db.menu.findOne({ type: 'extentions' });
            if (menu && menu.items.findIndex((item) => item.name === extension.name) == -1) {
                menu.items.push(new MenuItem(extension.name, "", "", "/extensions/" + packageJson.id, [], "link"));
                let res = await db.menu.updateOne({ type: 'extentions' }, { $set: { items: menu.items } });
                console.log(res);
            }
            if (firstStart) {
                db.extensions.insertOne(new ExtensionModel(extension.name, packageJson.description || "", packageJson.version, packageJson.author || "", packageJson.authorUrl || "", packageJson.url || "", packageJson.id));
            }
            extensions.add(extension, file, packageJson.id);
        }
        extensions.get(file, 'folder')?.run();
    });
    return app;
}