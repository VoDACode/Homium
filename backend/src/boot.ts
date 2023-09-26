import { exec } from 'child_process';
import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { uuid } from 'uuidv4';
import { DownloaderHelper } from 'node-downloader-helper';
import extract from 'extract-zip'

import { serviceManager, IDatabaseService, ILogService, ILogger, IExtensionsService } from 'homium-lib/services';
import { ExtensionModel, UserModel } from 'homium-lib/models';
import { Extension } from 'homium-lib/extension';

export function bootExtensions(app: express.Application) {
    return _bootExtensions(app, 'all');
}

export function bootNewExtensions(app: express.Application) {
    return _bootExtensions(app, 'onlyNew');
}

export function loadControllers(app: express.Application) {
    const logger = serviceManager.get(ILogger, 'Boot');
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
        if (controller.IN_ROOT) {
            logger.debug('Controller in root: ' + name);
            app.use('/api/' + name, controller);
        }
        logger.debug('Controller in controllers: ' + name);
        app.use('/api/controllers/' + name, controller);
    });
    return app;
}

export async function firstStart() {
    const logger = serviceManager.get(ILogger, 'Boot');
    let firstStart = false;
    logger.info('Checking first start...');
    const db = serviceManager.get(IDatabaseService);
    if (await db.users.countDocuments() === 0) {
        logger.info('First start detected. Creating root user...');
        let root = new UserModel("root", "toor", undefined, undefined, UserModel.getTemplatePermissions('admin'));
        await db.users.insertOne(root);
        firstStart = true;
    }
    // if (firstStart) {
    //     logger.info('First start detected. Creating new linux user...');
    //     exec('useradd -m -s /bin/bash -p $(openssl passwd -1 toor) homium', (err, stdout, stderr) => {
    //         if (err) {
    //             logger.error('Error while creating linux user: ' + err);
    //         }
    //         logger.info('Linux user created.');
    //     });
    // }
    logger.info('First start check complete.');
}

export async function checkForUpdates() {
    const logger = serviceManager.get(ILogger, 'Boot');
    let logService = serviceManager.get(ILogService);

    let subDir = '';
    let installPath = path.join(__dirname, '..', '..', '..');
    let newVersion = '';

    logger.info('Checking for updates...');
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    if (!packageJson.version) {
        logger.warn('No version in package.json. Skipping...');
        return;
    }
    const version = packageJson.version;
    const channel = packageJson.update.channel || 'stable';
    const releasesUrl = 'https://api.github.com/repos/VoDACode/Homium/releases';
    let releases = await (await fetch(releasesUrl)).json();
    // ignore pre-releases and drafts and get only channel releases
    releases = releases.filter((release: any) => {
        return release.prerelease === false && release.draft === false && release.tag_name.endsWith(channel);
    });
    if (releases.length === 0) {
        logger.info('No updates found.');
        return;
    }
    // sort releases by date
    releases.sort((a: any, b: any) => {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
    // get latest release
    const latestRelease = releases[0];
    if (latestRelease.tag_name === version) {
        logger.info('You have the latest ' + channel + ' version.');
        return;
    }
    newVersion = latestRelease.tag_name;
    logger.info('Update found: ' + latestRelease.tag_name);
    logService.onlyConsole = true;
    // download update

    let updateUrl = latestRelease.zipball_url;
    updateUrl = updateUrl.replace('https://api.github.com/repos/', 'https://codeload.github.com/');
    updateUrl = updateUrl.replace('/zipball/', '/legacy.zip/refs/tags/');

    const updatePath = path.join(__dirname, '..', '..', '..', 'tmp');
    if (await fs.existsSync(updatePath)) {
        await fs.rmSync(updatePath, { recursive: true });
    }
    fs.mkdirSync(updatePath, { recursive: true });
    logger.info('Downloading update...');

    logger.info(`Downloading file: ${updateUrl} => ${updatePath}`);

    const dl = new DownloaderHelper(updateUrl, updatePath);
    dl.on('end', async () => {
        logger.info('Download complete.');
        await unpack();
    });
    dl.on('error', (err) => {
        logger.error('Download error: ' + err);
    });
    dl.start();

    return newVersion;

    async function unpack() {
        logger.info('Extracting update...');
        let parsedFileName = path.parse(dl.getDownloadPath());

        {
            // name VoDACode-Homium-v0.0.4-alpha-0-g40d6099
            // sub path should be VoDACode-Homium-40d6099

            let name = parsedFileName.name;
            let split = name.split('-');
            // remove first 'g' from split[split.length - 1] and add '-' between split[0] and split[1]
            let subName = split[0] + '-' + split[1] + '-' + split[split.length - 1].substring(1);
            subDir = path.join(parsedFileName.dir, subName);
        }
        logger.debug(`subDir: ${subDir}`);
        logger.info(`Extracting file: ${dl.getDownloadPath()} => ${updatePath}`);
        await extract(dl.getDownloadPath(), { dir: updatePath });
        logger.info('Extracting complete.');
        // rm archive
        fs.removeSync(dl.getDownloadPath());
        // copy files from secret folder to tmp folder
        // I wont to copy copy:
        // /backend/dist/src/configs/*
        // /backend/dist/src/extensions/*

        // /backend/dist/src/configs/* => /tmp/configs/*
        let srcConfigsPath = path.join(__dirname, 'configs');
        if (!fs.existsSync(srcConfigsPath)) {
            logger.warn('No configs folder found. Skipping...');
        } else {
            let destConfigsPath = path.join(updatePath, 'configs');
            logger.info(`Copying files: ${srcConfigsPath} => ${destConfigsPath}`);
            await fs.mkdirSync(destConfigsPath, { recursive: true });
            await fs.copy(srcConfigsPath, destConfigsPath);
            logger.info('Copying complete.');
        }

        // /backend/dist/src/extensions/* => /tmp/extensions/*
        let srcExtensionsPath = path.join(__dirname, 'extensions');
        if (!fs.existsSync(srcExtensionsPath)) {
            logger.warn('No extensions folder found. Skipping...');
        }
        else {
            let destExtensionsPath = path.join(updatePath, 'extensions');
            logger.info(`Copying files: ${srcExtensionsPath} => ${destExtensionsPath}`);
            await fs.mkdirSync(destExtensionsPath, { recursive: true });
            await fs.copy(srcExtensionsPath, destExtensionsPath);
            logger.info('Copying complete.');
        }

        // remove /* whthout /tmp/*
        logger.info('Removing old files...');
        let oldFiles = fs.readdirSync(installPath);
        oldFiles.forEach(async (file) => {
            if (file === 'tmp') {
                return;
            }
            fs.removeSync(path.join(installPath, file));
        });

        logger.info('Removing complete.');

        // copy files from subDir to installPath
        logger.info(`Copying files: ${subDir} => ${installPath}`);
        await fs.copy(subDir, installPath);
        logger.info('Copying complete.');

        // init and build apps
        logger.info('Installing dependencies...');
        initMainApp();
        return true;
    }

    function initMainApp() {
        exec('npm install', { cwd: installPath }, (error, stdout, stderr) => {
            if (error) {
                logger.error('Error while installing dependencies: ' + error);
                return;
            }
            if (stderr) {
                logger.error('Error while installing dependencies: ' + stderr);
                return;
            }
            logger.info('Dependencies installed.');
            initFrontendApp();
        });
    }

    function initFrontendApp() {
        logger.info('Installing frontend dependencies...');
        let frontendPath = path.join(installPath, 'client-app');
        let installProc = exec('npm install', { cwd: frontendPath });
        installProc.stdout?.on('data', (data) => {
            logger.debug('Frontend install: ' + data);
        });
        installProc.stderr?.on('data', (data) => {
            logger.debug('Frontend install: ' + data);
        });
        installProc.on('close', (code) => {
            if (code !== 0) {
                logger.error('Error while installing frontend dependencies: ' + code);
                return;
            }
            logger.info('Frontend dependencies installed.');
            let buildProc = exec('npm run build', { cwd: frontendPath });
            buildProc.stdout?.on('data', (data) => {
                logger.debug('Frontend build: ' + data);
            });
            buildProc.stderr?.on('data', (data) => {
                logger.debug('Frontend build: ' + data);
            });
            buildProc.on('close', (code) => {
                if (code !== 0) {
                    logger.error('Error while building frontend: ' + code);
                    return;
                }
                logger.info('Frontend built.');
                initBackendApp();
            });
        });
    }

    function initBackendApp() {
        let backendPath = path.join(installPath, 'backend');
        logger.info('Installing backend dependencies...');

        let installProc = exec('npm install', { cwd: backendPath });
        installProc.stdout?.on('data', (data) => {
            logger.debug('Backend install: ' + data);
        });
        installProc.stderr?.on('data', (data) => {
            logger.debug('Backend install: ' + data);
        });
        installProc.on('close', (code) => {
            if (code !== 0) {
                logger.error('Error while installing backend dependencies: ' + code);
                return;
            }
            logger.info('Backend dependencies installed.');
            let buildProc = exec('npm run build', { cwd: backendPath });
            buildProc.stdout?.on('data', (data) => {
                logger.debug('Backend build: ' + data);
            });
            buildProc.stderr?.on('data', (data) => {
                logger.debug('Backend build: ' + data);
            });
            buildProc.on('close', (code) => {
                if (code !== 0) {
                    logger.error('Error while building backend: ' + code);
                    return;
                }
                logger.info('Backend built.');
                restoreSecrets();
            });
        });
    }

    function restoreSecrets() {
        logger.info('Restoring secrets...');
        // copy files:
        // /tmp/configs/* => /backend/dist/src/configs/*
        let srcConfigsPath = path.join(updatePath, 'configs');
        if (!fs.existsSync(srcConfigsPath)) {
            logger.warn('No configs folder found. Skipping...');
        }
        else {
            let destConfigsPath = path.join(__dirname, 'configs');
            logger.info(`Copying files: ${srcConfigsPath} => ${destConfigsPath}`);
            fs.mkdirSync(destConfigsPath, { recursive: true });
            fs.copySync(srcConfigsPath, destConfigsPath, { overwrite: true });
            logger.info('Copying complete.');
        }

        // /tmp/extensions/* => /backend/dist/src/extensions/*
        let srcExtensionsPath = path.join(updatePath, 'extensions');
        if (!fs.existsSync(srcExtensionsPath)) {
            logger.warn('No extensions folder found. Skipping...');
        }
        else {
            let destExtensionsPath = path.join(__dirname, 'extensions');
            logger.info(`Copying files: ${srcExtensionsPath} => ${destExtensionsPath}`);
            fs.mkdirSync(destExtensionsPath, { recursive: true });
            fs.copySync(srcExtensionsPath, destExtensionsPath, { overwrite: true });
            logger.info('Copying complete.');
        }

        // remove /tmp
        logger.info('Removing tmp folder...');
        fs.removeSync(updatePath);
        logger.info('Removing complete.');
        logger.info('Update complete.');
        logger.info('Restarting...');
        logService.waitToFinish().then(() => {
            exec('cd / && systemctl restart homium', (error, stdout, stderr) => {
                if (error) {
                    logger.error('Error while restarting: ' + error);
                    process.exit(1);
                }
                if (stderr) {
                    logger.error('Error while restarting: ' + stderr);
                    process.exit(1);
                }
                logger.info('Restarting complete.');
                process.exit(0);
            });
        });
    }

}

function _bootExtensions(app: express.Application, mode: 'onlyNew' | 'all') {
    const logger = serviceManager.get(ILogger, 'Boot');
    logger.info('Booting extensions...');
    const extensionsPath = path.join(__dirname, 'extensions');
    const db = serviceManager.get(IDatabaseService);
    const extensions = serviceManager.get(IExtensionsService);
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
        if (!packageJson.name) {
            logger.warn(`Extension ${file} has no name in package.json file. Skipping...`);
            return;
        }
        if (!packageJson.dependencies || !packageJson.version) {
            logger.warn(`Extension ${file} has no dependencies or version in package.json file. Skipping...`);
            return;
        }

        if (packageJson.disabled === true) {
            logger.warn(`Extension ${file} is disabled. Skipping...`);
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
            const extension: Extension = original as Extension;
            if (!(original.__proto__ instanceof Extension)) {
                logger.warn(`Extension ${file} is not extending Extension. Skipping...`);
                return;
            }
            logger.info(`Extension ${file} booted.`);
            logger.info(`Extension ${file} version: ${packageJson.version}`);
            logger.info(`Extension ${file} author: '${packageJson.author || 'Unknown'}'`);
            logger.info(`Extension ${file} id: ${packageJson.id}`);

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
        try {
            extensions.get(file, 'folder')?.start();
        } catch (e) {
            logger.error(`Extension ${file} failed to start. Error: ${e}`);
            return;
        }
        logger.info(`Extension ${file} started.`);
    });
    return app;
}