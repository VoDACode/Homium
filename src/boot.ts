import { exec } from 'child_process';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { IExtension } from './types/IExtension';
import extensions from './services/extensions';
import db from './db';
import { UserModel } from './models/UserModel';

const app = express();

export function bootExtensions() {
    return _bootExtensions('all');
}

export function bootNewExtensions() {
    return _bootExtensions('onlyNew');
}

export function loadControllers(){
    const controllersPath = path.join(__dirname, 'controllers');
    fs.readdirSync(controllersPath).forEach((file) => {
        if(file.endsWith('.map')){
            return;
        }
        if(!file.endsWith('.ts') && !file.endsWith('.js') && fs.lstatSync(path.join(controllersPath, file)).isDirectory()) {
            return;
        }
        let controller = require(path.join(controllersPath, file));
        let name = file.replace(' ', '-').replace('.ts', '').replace('.js', '');
        if(controller.ROUTER){
            name = controller.ROUTER;
        }
        app.use('/api/controllers/' + name, controller);
        console.log('Loaded controller: ' + name);
    });
    return app;
}

export async function firstStart(){
    if(await db.users.countDocuments() !== 0)
        return;
    await db.users.insertOne(new UserModel("root", "toor"));
}

function _bootExtensions(mode: 'onlyNew' | 'all') {
    const extensionsPath = path.join(__dirname, 'extensions');
    fs.readdirSync(extensionsPath).forEach((file) => {
        let isExist = false;
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
        if (!packageJson.dependencies) {
            return;
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
                    if(controller.ROUTER){
                        name = controller.ROUTER;
                    }
                    console.log('Adding route: ' + '/extensions/' + extension.name + '/api/' + name);
                    app.use('/extensions/' + extension.name + '/api/' + name, controller);
                });
            }
            extensions.add(extension, file);
        }
        extensions.get(file, 'folder')?.run();
    });
    return app;
}