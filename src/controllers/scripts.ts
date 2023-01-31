import * as express from 'express';
import { uuid } from 'uuidv4';
import db from '../db';
import { authGuard, isAuthorized } from '../guards/AuthGuard';
import { ScriptModel, ScriptTargetEvent, ScriptTargetType } from '../models/ScriptModel';
import ScriptService from '../services/ScriptService';

export const router = express.Router();

router.post('/', authGuard, async (req, res) => {
    const name = req.body.name;
    const code = req.body.code;
    const targetEvent = req.body.targetEvent as ScriptTargetEvent;
    const targetType = req.body.targetType as ScriptTargetType;
    const allowAnonymous = req.body.allowAnonymous;
    const description = req.body.description;
    const tagretId = req.body.tagretId as string;

    if(!name || typeof name !== 'string' || name.length < 1){
        res.status(400).send({ error: "Invalid name" });
        return;
    }

    if(!code || typeof code !== 'string' || code.length < 1){
        res.status(400).send({ error: "Invalid code" });
        return;
    }

    if(!targetEvent || typeof targetEvent !== 'string' || targetEvent.length < 1){
        res.status(400).send({ error: "Invalid target event" });
        return;
    }

    if(!targetType || typeof targetType !== 'string' || targetType.length < 1){
        res.status(400).send({ error: "Invalid target type" });
        return;
    }

    if(allowAnonymous !== undefined && typeof allowAnonymous !== 'boolean'){
        res.status(400).send({ error: "Invalid allow anonymous" });
        return;
    }

    if(description !== undefined && typeof description !== 'string'){
        res.status(400).send({ error: "Invalid description" });
        return;
    }

    let id = "";
    do{
        id = uuid();
    }while((await db.scripts.countDocuments({ id: id })) > 0);

    const script = new ScriptModel(id, name, code, targetEvent, targetType);
    script.allowAnonymous = allowAnonymous || false;
    script.description = description || "";
    script.targetId = tagretId || "";

    await ScriptService.createScript(script);
    res.status(201).send({ id: id });
});

router.get('/', authGuard, async (req, res) => {
    res.status(200).json(await ScriptService.getIds());
});

router.get('/:id', authGuard, async (req, res) => {
    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send({ error: "Invalid id" });
        return;
    }
    try{
        let script = await ScriptService.getScript(req.params.id);
        res.status(200).json(script);
    }catch(e){
        res.status(404).send({ error: "Script not found" });
    }
});

router.put('/:id', authGuard, async (req, res) => {
    let script = req.body as ScriptModel;
    if(!script){
        res.status(400).send({ error: "Invalid script" });
        return;
    }
    try{
        await ScriptService.updateScript(script);
        res.status(200).send({ success: true });
    }catch(e){
        res.status(404).send({ error: "Script not found" });
    }
});

router.put("/:id/code", authGuard, async (req, res) => {
    const code = req.body;
    if(!code || typeof code !== 'string' || code.length < 1){
        res.status(400).send({ error: "Invalid code" });
        return;
    }
    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send({ error: "Invalid id" });
        return;
    }
    try{
        await ScriptService.updateScriptCode(req.params.id, code);
        res.status(200).send({ success: true });
    }catch(e){
        res.status(404).send({ error: "Script not found" });
    }
});

router.delete('/:id', authGuard, async (req, res) => {
    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send({ error: "Invalid id" });
        return;
    }
    await ScriptService.deleteScript(req.params.id);
    res.status(200).send({ success: true });
});

router.get('/:id/execute', async (req, res) => {
    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send({ error: "Invalid id" });
        return;
    }

    if(await ScriptService.isAllowAnonymous(req.params.id) === false && await isAuthorized(req) === false){
        res.status(401).send({ error: "Unauthorized" }).redirect('/auth');
        return;
    }

    if(await (await ScriptService.getScript(req.params.id)).targetEvent !== 'call'){
        res.status(400).send({ error: "Invalid target event" });
        return;
    }

    try{
        await ScriptService.executeScript(req.params.id, []);
        res.status(200).send({ success: true });
    }catch(e){
        res.status(404).send({ error: "Script not found" });
    }
});

module.exports = router;