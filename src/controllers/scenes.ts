import * as express from 'express';
import { uuid } from 'uuidv4';
import db from '../db';
import { authGuard, hasPermission } from '../guards/AuthGuard';
import { SceneModel } from '../models/SceneModel';
import { SceneObject } from '../models/SceneObject';
import { Logger } from '../services/LogService';

const router = express.Router();
const logger = new Logger('ScenesController');

router.get('/list', authGuard, async (req, res) => {
    res.send(await db.scenes.find().map(s => {
        return {
            id: s.id,
            name: s.name,
            description: s.description
        };
    }).toArray()).status(200).end();
});

router.get('/details/:id', authGuard, (req, res) => {
    let id = req.params.id as string;
    if(!id || typeof id !== 'string' || id.length !== 36){
        res.status(400).send('Invalid scene id').end();
        return;
    }

    db.scenes.findOne({id: id}).then(s => {
        if(!s){
            res.status(404).send('Scene not found').end();
            return;
        }
        res.send({
            id: s.id,
            name: s.name,
            description: s.description,
            sceneObjects: s.sceneObjects
        }).status(200).end();
    }).catch(err => {
        logger.error(err.message);
        res.status(500).send(err.message).end();
    });
});

router.get('/screen/:id', authGuard, (req, res) => {
    let id = req.params.id as string;
    if(!id || typeof id !== 'string' || id.length !== 36){
        res.status(400).send('Invalid scene id').end();
        return;
    }

    db.scenes.findOne({id: id}).then(s => {
        if(!s){
            res.status(404).send('Scene not found').end();
            return;
        }
        if(!s.screenshot){
            res.status(404).send('Scene screenshot not found').end();
            return;
        }
        res.send(`<img src='${s.screenshot}'>`).status(200).end();
    }).catch(err => {
        logger.error(err.message);
        res.status(500).send(err.message).end();
    });
});

router.post('/create', authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.scense.create) !== true){
        res.status(403).send('Permission denied!').end();
        return;
    }


    const name = req.body.name as string;
    const description: string = req.body.description || '';
    const sceneObjects = req.body.sceneObjects as SceneObject[];

    if(!name || typeof name !== 'string'){
        res.status(400).send('Invalid scene name').end();
        return;
    }

    if(!sceneObjects || !Array.isArray(sceneObjects)){
        res.status(400).send('Invalid scene objects').end();
        return;
    }

    let id = uuid();
    while(await db.scenes.countDocuments({id: id}) > 0){
        id = uuid();
    }

    let scene = new SceneModel(id, name, description);
    scene.sceneObjects = sceneObjects;

    db.scenes.insertOne(scene).then(() => {
        res.status(201).send('Scene created').end();
    }).catch(err => {
        logger.error(err.message);
        res.status(500).send(err.message).end();
    });
});

router.put('/update/:id', authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.scense.update) !== true){
        res.status(403).send('Permission denied!').end();
        return;
    }


    const id = req.params.id as string;
    const name = req.body.name as string;
    const description: string = req.body.description || '';
    const sceneObjects = req.body.sceneObjects as SceneObject[];

    if(!id || typeof id !== 'string' || id.length !== 36){
        res.status(400).send('Invalid scene id').end();
        return;
    }

    const scene = await db.scenes.findOne({id: id});
    if(!scene){
        res.status(404).send('Scene not found').end();
        return;
    }

    if(name !== undefined && (typeof name !== 'string' || name.length < 2)){
        res.status(400).send('Invalid scene name').end();
        return;
    } else if(name !== undefined && name.length > 1){
        scene.name = name;
    }

    if(description !== undefined && (typeof description !== 'string' || description.length < 2)){
        res.status(400).send('Invalid scene description').end();
        return;
    } else if(description !== undefined && description.length > 1){
        scene.description = description;
    }

    if(sceneObjects !== undefined && (!Array.isArray(sceneObjects) || sceneObjects.length < 1)){
        res.status(400).send('Invalid scene objects').end();
        return;
    } else if(sceneObjects !== undefined && sceneObjects.length > 0){
        scene.sceneObjects = sceneObjects;
    }

    await db.scenes.updateOne({id: id}, {$set: scene});

    res.status(200).send('Scene updated').end();
});

router.delete('/delete/:id', authGuard, async (req, res) => {

    if(await hasPermission(req, p => p.scense.remove) !== true){
        res.status(403).send('Permission denied!').end();
        return;
    }

    const id = req.params.id as string;

    if(!id || typeof id !== 'string' || id.length !== 36){
        res.status(400).send('Invalid scene id').end();
        return;
    }

    const scene = await db.scenes.findOne({id: id});

    if(!scene){
        res.status(404).send('Scene not found').end();
        return;
    }

    await db.scenes.deleteOne({id: id});

    res.status(200).send('Scene deleted').end();
});


module.exports = router;