import * as express from 'express';
import { uuid } from 'uuidv4';
import { authGuard, hasPermission, isAuthorized } from 'homium-lib/utils/auth-guard';
import { ScriptTargetEvent, ScriptTargetType } from 'homium-lib/types/script.types';
import { serviceManager, IDatabaseService, IExtensionsService, IObjectService, IScriptService } from 'homium-lib/services';
import { ScriptModel } from 'homium-lib/models';

export const router = express.Router();

router.post('/', authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.script.create) !== true) {
        res.status(403).send('You do not have permission to create scripts');
        return;
    }

    const name = req.body.name;
    const code = req.body.code;
    const targetEvent = req.body.targetEvent as ScriptTargetEvent;
    const targetType = req.body.targetType as ScriptTargetType;
    const allowAnonymous = req.body.allowAnonymous;
    const description = req.body.description;
    const targetId = req.body.targetId as string;
    const enabled = req.body.enabled;

    if (!name || typeof name !== 'string' || name.length < 1) {
        res.status(400).send("Invalid name");
        return;
    }

    if (!code || typeof code !== 'string' || code.length < 1) {
        res.status(400).send("Invalid code");
        return;
    }

    if (!targetEvent || typeof targetEvent !== 'string' || targetEvent.length < 1) {
        res.status(400).send("Invalid target event");
        return;
    }

    if (!targetType || typeof targetType !== 'string' || targetType.length < 1) {
        res.status(400).send("Invalid target type");
        return;
    }

    if (allowAnonymous !== undefined && typeof allowAnonymous !== 'boolean') {
        res.status(400).send("Invalid allow anonymous");
        return;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send("Invalid description");
        return;
    }

    if (enabled !== undefined && typeof enabled !== 'boolean') {
        res.status(400).send("Invalid enabled");
        return;
    }

    const db = serviceManager.get(IDatabaseService);
    const extensions = serviceManager.get(IExtensionsService);
    const objectService = serviceManager.get(IObjectService);
    const scriptService = serviceManager.get(IScriptService);

    let id = "";
    do {
        id = uuid();
    } while ((await db.scripts.countDocuments({ id: id })) > 0);

    const script = new ScriptModel(id, name, code, targetEvent, targetType);
    script.allowAnonymous = allowAnonymous || false;
    script.description = description || "";
    script.targetId = targetId || "";
    script.enabled = enabled || false;

    if (targetType === 'Extension' && extensions.any(targetId, 'id') === false) {
        res.status(400).send("Invalid extension id");
        return;
    } else if (targetType === 'Object' && await objectService.any(targetId) == false) {
        res.status(400).send("Invalid object id");
        return;
    }

    await scriptService.createScript(script);
    res.status(201).send({ id: id });
});

router.get('/', authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.script.read) !== true) {
        res.status(403).send('You do not have permission to read scripts');
        return;
    }

    const scriptService = serviceManager.get(IScriptService);

    res.status(200).json(await scriptService.getIds());
});

router.get('/:id', authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.script.read) !== true) {
        res.status(403).send('You do not have permission to read scripts');
        return;
    }

    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1) {
        res.status(400).send("Invalid id");
        return;
    }
    try {
        const scriptService = serviceManager.get(IScriptService);
        let script = await scriptService.getScript(req.params.id);
        res.status(200).json(script);
    } catch (e) {
        res.status(404).send("Script not found");
    }
});

router.put('/:id', authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.script.read) !== true) {
        res.status(403).send('You do not have permission to update scripts');
        return;
    }

    const name: string | undefined = req.body.name;
    const code: string | undefined = req.body.code;
    const targetEvent: ScriptTargetEvent | undefined = req.body.targetEvent as ScriptTargetEvent;
    const allowAnonymous: boolean | undefined = req.body.allowAnonymous;
    const description: string | undefined = req.body.description;
    const enabled: boolean | undefined = req.body.enabled;

    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1) {
        res.status(400).send("Invalid id");
        return;
    }

    const scriptService = serviceManager.get(IScriptService);

    let script = await scriptService.getScript(req.params.id);
    if (!script) {
        res.status(400).send("Invalid script");
        return;
    }

    if (name !== undefined && (typeof name !== 'string' || name.length < 1)) {
        res.status(400).send("Invalid name");
        return;
    } else if (name !== undefined && name !== script.name && name.length > 0) {
        script.name = name;
    }

    if (code !== undefined && (typeof code !== 'string' || code.length < 1)) {
        res.status(400).send("Invalid code");
        return;
    } else if (code !== undefined && code !== script.code && code.length > 0) {
        script.code = code;
    }

    if (targetEvent !== undefined && (typeof targetEvent !== 'string' || targetEvent.length < 1)) {
        res.status(400).send("Invalid target event");
        return;
    } else if (targetEvent !== undefined && targetEvent !== script.targetEvent && targetEvent.length > 0) {
        script.targetEvent = targetEvent;
    }

    if (allowAnonymous !== undefined && typeof allowAnonymous !== 'boolean') {
        res.status(400).send("Invalid allow anonymous");
        return;
    } else if (allowAnonymous !== undefined && allowAnonymous !== script.allowAnonymous) {
        script.allowAnonymous = allowAnonymous;
    }

    if (enabled !== undefined && typeof enabled !== 'boolean') {
        res.status(400).send("Invalid enabled");
        return;
    } else if (enabled !== undefined && enabled !== script.enabled) {
        script.enabled = enabled;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send("Invalid description");
        return;
    } else if (description !== undefined && description !== script.description) {
        script.description = description;
    }

    try {
        await scriptService.updateScript(script);
        res.status(200).send({ success: true });
    } catch (e) {
        res.status(404).send("Script not found");
    }
});

router.put("/:id/code", authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.script.read) !== true) {
        res.status(403).send('You do not have permission to update scripts');
        return;
    }

    const code = req.body;
    if (!code || typeof code !== 'string' || code.length < 1) {
        res.status(400).send("Invalid code");
        return;
    }
    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1) {
        res.status(400).send("Invalid id");
        return;
    }
    try {
        const scriptService = serviceManager.get(IScriptService);
        await scriptService.updateScriptCode(req.params.id, code);
        res.status(200).send({ success: true });
    } catch (e) {
        res.status(404).send("Script not found");
    }
});

router.delete('/:id', authGuard, async (req, res) => {

    if (await hasPermission(req, p => p.script.remove) !== true) {
        res.status(403).send('You do not have permission to delete scripts');
        return;
    }

    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1) {
        res.status(400).send("Invalid id");
        return;
    }

    const scriptService = serviceManager.get(IScriptService);

    await scriptService.deleteScript(req.params.id);
    res.status(200).send({ success: true });
});

router.get('/:id/execute', async (req, res) => {
    if (!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1) {
        res.status(400).send("Invalid id");
        return;
    }

    const scriptService = serviceManager.get(IScriptService);

    try {
        if (await scriptService.isAllowAnonymous(req.params.id) === false) {
            if (await isAuthorized(req) === false) {
                res.status(401).send("Unauthorized").redirect('/auth');
                return;
            } else if (await hasPermission(req, p => p.script.execute) !== true) {
                res.status(403).send('You do not have permission to execute scripts');
                return;
            }
        }

    } catch (e) {
        res.status(404).send("Script not found");
        return;
    }
    if (await (await scriptService.getScript(req.params.id)).targetEvent !== 'call') {
        res.status(400).send("Invalid target event");
        return;
    }

    if (await (await scriptService.getScript(req.params.id)).enabled === false) {
        res.status(400).send("Script is disabled");
        return;
    }

    try {
        await scriptService.executeScript(req.params.id, []);
        res.status(200).send({ success: true });
    } catch (e: any) {
        res.status(404).send(e);
    }
});

module.exports = router;