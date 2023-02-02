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
import { Logger } from './services/LogService';

const app = express();
const logger = new Logger('boot');

export function bootExtensions() {
    return _bootExtensions('all');
}

export function bootNewExtensions() {
    return _bootExtensions('onlyNew');
}

export function loadControllers() {
    logger.info('Loading controllers...');
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
        logger.debug('Loading controller: ' + name);
        if(controller.IN_ROOT){
            logger.debug('Controller in root: ' + name);
            app.use('/api/' + name, controller);
        }
        logger.debug('Controller in controllers: ' + name);
        app.use('/api/controllers/' + name, controller);
    });
    return app;
}

export async function firstStart() {
    logger.info('Checking first start...');
    if (await db.users.countDocuments() === 0) {
        logger.info('First start detected. Creating root user...');
        await db.users.insertOne(new UserModel("root", "toor"));
    }
    logger.info('First start check complete.');
}

function _bootExtensions(mode: 'onlyNew' | 'all') {
    logger.info('Booting extensions...');
    const extensionsPath = path.join(__dirname, 'extensions');
    fs.readdirSync(extensionsPath).forEach(async (file) => {
        let isExist = false;
        let firstStart = false;
        if (!fs.lstatSync(path.join(extensionsPath, file)).isDirectory()) {
            return;
        }
        logger.info(`Checking extension ${file}...`);

        if (!fs.existsSync(path.join(extensionsPath, file, 'index.js')) && !fs.existsSync(path.join(extensionsPath, file, 'index.ts'))) {
            logger.warn(`Extension ${file} has no index.js file. Skipping...`);
            return;
        }

        if (!fs.existsSync(path.join(extensionsPath, file, 'package.json'))) {
            logger.warn(`Extension ${file} has no package.json file. Skipping...`);
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
        if(!packageJson.name){
            logger.warn(`Extension ${file} has no name in package.json file. Skipping...`);
            return;
        }
        if (!packageJson.dependencies || !packageJson.version) {
            logger.warn(`Extension ${file} has no dependencies or version in package.json file. Skipping...`);
            return;
        }
        if (!packageJson.id || await db.extensions.countDocuments({ id: packageJson.id }) == 0) {
            logger.info(`Extension ${file} has no id in package.json file. Generating...`);
            firstStart = true;
            do {
                packageJson.id = uuid();
            } while ((await db.extensions.countDocuments({ id: packageJson.id })) != 0);
            logger.info(`Extension ${file} id generated: ${packageJson.id}`);
        }

        // check if dependencies are installed
        logger.info(`Checking dependencies for extension ${file}...`);
        for (const dependency in packageJson.dependencies) {
            if (!fs.existsSync(path.join(extensionsPath, file, 'node_modules', dependency))) {
                logger.info(`Dependency ${dependency} not found. Installing...`);
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
            const original = new (require(path.join(extensionsPath, file)))(packageJson.id);
            const extension: IExtension = original as IExtension;
            if(!(original.__proto__ instanceof IExtension)){
                logger.warn(`Extension ${file} is not extending IExtension. Skipping...`);
                return;
            }
            logger.info(`Extension ${file} booted.`);
            logger.info(`Extension ${file} version: ${packageJson.version}`);
            logger.info(`Extension ${file} author: '${packageJson.author || 'Unknown'}'`);

            app.use('/extensions/' + packageJson.id + '/static', express.static(path.join(extensionsPath, file, 'static')));
            logger.debug(`Extension ${file} static folder mounted. [${path.join(extensionsPath, file, 'static')}] => [/extensions/${packageJson.id}/static]`);

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
                    let name = apiRouteFile.replace(' ', '-').replace('.ts', '').replace('.js', '');
                    if (controller.ROUTER) {
                        name = controller.ROUTER;
                    }
                    logger.debug(`Extension ${file} api route ${name} mounted.`);
                    app.use('/extensions/' + packageJson.id + '/api/' + name, controller);
                });
            }

            const info = new ExtensionModel(packageJson.name, packageJson.description || "", packageJson.version, packageJson.author || "", packageJson.authorUrl || "", packageJson.url || "", packageJson.id);
            if (firstStart) {
                logger.debug(`Extension ${file} first start. Adding to database...`);
                db.extensions.insertOne(info);
                fs.writeFileSync(path.join(extensionsPath, file, 'package.json'), JSON.stringify(packageJson));
                logger.debug(`Extension ${file} added to database.`);
            }
            extensions.add(extension, original, info, file);
            logger.debug(`Extension ${file} added to extensions list.`);
        }
        logger.info(`Starting extension ${file}...`);
        try{
            extensions.get(file, 'folder')?.start();
        }catch(e){
            logger.error(`Extension ${file} failed to start. Error: ${e}`);
            return;
        }
        logger.info(`Extension ${file} started.`);
    });
    return app;
}