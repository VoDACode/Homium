import * as express from 'express';
import { uuid } from 'uuidv4';
import db from '../db';
import { authGuard, hasPermission, isAuthorized } from '../guards/AuthGuard';
import { ScriptModel, ScriptTargetEvent, ScriptTargetType } from '../models/ScriptModel';
import ScriptService from '../services/ScriptService';

export const router = express.Router();

router.post('/', authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.script.create) !== true){
        res.status(403).send('You do not have permission to create scripts');
        return;
    }

    const name = req.body.name;
    const code = req.body.code;
    const targetEvent = req.body.targetEvent as ScriptTargetEvent;
    const targetType = req.body.targetType as ScriptTargetType;
    const allowAnonymous = req.body.allowAnonymous;
    const description = req.body.description;
    const tagretId = req.body.tagretId as string;

    if(!name || typeof name !== 'string' || name.length < 1){
        res.status(400).send("Invalid name");
        return;
    }

    if(!code || typeof code !== 'string' || code.length < 1){
        res.status(400).send("Invalid code");
        return;
    }

    if(!targetEvent || typeof targetEvent !== 'string' || targetEvent.length < 1){
        res.status(400).send("Invalid target event");
        return;
    }

    if(!targetType || typeof targetType !== 'string' || targetType.length < 1){
        res.status(400).send("Invalid target type");
        return;
    }

    if(allowAnonymous !== undefined && typeof allowAnonymous !== 'boolean'){
        res.status(400).send("Invalid allow anonymous");
        return;
    }

    if(description !== undefined && typeof description !== 'string'){
        res.status(400).send("Invalid description");
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

    if(await hasPermission(req, p => p.script.read) !== true){
        res.status(403).send('You do not have permission to read scripts');
        return;
    }

    res.status(200).json(await ScriptService.getIds());
});

router.get('/:id', authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.script.read) !== true){
        res.status(403).send('You do not have permission to read scripts');
        return;
    }

    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send("Invalid id");
        return;
    }
    try{
        let script = await ScriptService.getScript(req.params.id);
        res.status(200).json(script);
    }catch(e){
        res.status(404).send("Script not found");
    }
});

router.put('/:id', authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.script.read) !== true){
        res.status(403).send('You do not have permission to update scripts');
        return;
    }

    const name: string | undefined = req.body.name;
    const code: string | undefined = req.body.code;
    const targetEvent: ScriptTargetEvent | undefined = req.body.targetEvent as ScriptTargetEvent;
    const allowAnonymous: boolean | undefined = req.body.allowAnonymous;
    const description: string | undefined = req.body.description;

    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send("Invalid id");
        return;
    }

    let script = await ScriptService.getScript(req.params.id);
    if(!script){
        res.status(400).send("Invalid script");
        return;
    }
    
    if(name !== undefined && (typeof name !== 'string' || name.length < 1)){
        res.status(400).send("Invalid name");
        return;
    }else if(name !== undefined && name !== script.name && name.length > 0){
        script.name = name;
    }

    if(code !== undefined && (typeof code !== 'string' || code.length < 1)){
        res.status(400).send("Invalid code");
        return;
    }else if(code !== undefined && code !== script.code && code.length > 0){
        script.code = code;
    }

    if(targetEvent !== undefined && (typeof targetEvent !== 'string' || targetEvent.length < 1)){
        res.status(400).send("Invalid target event");
        return;
    }else if(targetEvent !== undefined && targetEvent !== script.targetEvent && targetEvent.length > 0){
        script.targetEvent = targetEvent;
    }

    if(allowAnonymous !== undefined && typeof allowAnonymous !== 'boolean'){
        res.status(400).send("Invalid allow anonymous");
        return;
    }else if(allowAnonymous !== undefined && allowAnonymous !== script.allowAnonymous){
        script.allowAnonymous = allowAnonymous;
    }

    if(description !== undefined && typeof description !== 'string'){
        res.status(400).send("Invalid description");
        return;
    }else if(description !== undefined && description !== script.description){
        script.description = description;
    }

    try{
        await ScriptService.updateScript(script);
        res.status(200).send({ success: true });
    }catch(e){
        res.status(404).send("Script not found");
    }
});

router.put("/:id/code", authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.script.read) !== true){
        res.status(403).send('You do not have permission to update scripts');
        return;
    }

    const code = req.body;
    if(!code || typeof code !== 'string' || code.length < 1){
        res.status(400).send("Invalid code");
        return;
    }
    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send("Invalid id");
        return;
    }
    try{
        await ScriptService.updateScriptCode(req.params.id, code);
        res.status(200).send({ success: true });
    }catch(e){
        res.status(404).send("Script not found");
    }
});

router.delete('/:id', authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.script.remove) !== true){
        res.status(403).send('You do not have permission to delete scripts');
        return;
    }

    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send("Invalid id");
        return;
    }
    await ScriptService.deleteScript(req.params.id);
    res.status(200).send({ success: true });
});

router.get('/:id/execute', async (req, res) => {
    if(!req.params.id || typeof req.params.id !== 'string' || req.params.id.length < 1){
        res.status(400).send("Invalid id");
        return;
    }

    if(await ScriptService.isAllowAnonymous(req.params.id) === false){
        if(await isAuthorized(req) === false){
            res.status(401).send("Unauthorized").redirect('/auth');
            return;
        }else if(await hasPermission(req, p => p.script.execute) !== true){
            res.status(403).send('You do not have permission to execute scripts');
            return;
        }
    }

    if(await (await ScriptService.getScript(req.params.id)).targetEvent !== 'call'){
        res.status(400).send("Invalid target event");
        return;
    }

    try{
        await ScriptService.executeScript(req.params.id, []);
        res.status(200).send({ success: true });
    }catch(e){
        res.status(404).send("Script not found");
    }
});

module.exports = router;