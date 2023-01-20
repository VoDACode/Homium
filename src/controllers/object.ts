import express from 'express';
import { uuid } from 'uuidv4';
import db from '../db';
import { authGuard, isAuthorized } from '../guards/AuthGuard';
import { ObjectModel } from '../models/ObjectModel';

const router = express.Router();

router.post('/create', authGuard, async (req, res) => {
    const name: string = req.body.name;
    const parentId: string | null = req.body.parentId ?? null;
    const description: string | null = req.body.description;
    const object: any = req.body.object;
    const allowAnonymous: boolean = req.body.allowAnonymous ?? false;

    if(!object || typeof object !== 'object')
        return res.status(400).end();

    if(!name) 
        return res.status(400).end();

    if(parentId != null && await db.objects.countDocuments({id: parentId}) == 0){
        return res.status(404).end();
    }
    let id: string = "";
    do{
        id = uuid();
    }while(await db.objects.countDocuments({id: id}) > 0);
    await db.objects.insertOne(new ObjectModel(name, parentId, id, description, object, allowAnonymous));
    res.status(200).send(id).end();
});

router.post('/remove/:id', authGuard, async (req, res) => {
    const id = req.params.id;
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    if(await db.objects.countDocuments({id: id}) == 0){
        return res.status(404).send('Object not found.').end();
    }
    let object = await db.objects.findOne({id: id});
    if(object?.systemObject){
        return res.status(403).send('This object is a system object and cannot be removed.').end();
    }

    remove(id).then(() => {
        res.status(200).send('Object removed.').end();
    });

    async function remove(id: string){
        return db.objects.find({parentId: id}).forEach((object: any) => {
            remove(object.id);
        }).then(async () => {
            await db.objects.deleteOne({id: id});
        });
    }
});

router.post('/update/:id/object', authGuard, async (req, res) => {
    const id = req.params.id;
    const obj = req.body;
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    if(!obj || typeof obj !== 'object'){
        return res.status(400).send('The object must be a valid JSON object.').end();
    }
    let object = await db.objects.findOne({ id: id });
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    if(!object.allowAnonymous && !isAuthorized(req)){
        return res.status(401).send('You are not authorized to modify this object.').end();
    }
    if(object.systemObject){
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }
    await db.objects.updateOne({id: id}, {$set: {object: obj}});
    res.status(200).send('Object updated.').end();
});

router.post('/update/:id', authGuard, async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const allowAnonymous = req.body.allowAnonymous;
    const description = req.body.description;
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    let object = await db.objects.findOne({ id: id });
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    if(object.systemObject){
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }
    if(typeof allowAnonymous === 'boolean'){
        object.allowAnonymous = allowAnonymous;
    }
    if(typeof name === 'string'){
        if(name.length > 1){
            object.name = name;
        } else {
            return res.status(400).send('The name must be at least 2 characters long.').end();
        }
    }
    if(typeof description === 'string'){
        object.description = description;
    }
    await db.objects.updateOne({id: id}, {$set: object});
    res.status(200).send('Object updated.').end();
});

router.post('/update/:id/parent', authGuard,async (req, res) => {
    const id = req.params.id;
    const parentId = req.query.parentId;
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    if(parentId == null || typeof parentId !== 'string'){
        return res.status(400).send('The parentId must be a string.').end();
    }
    let object = await db.objects.findOne({ id: id });
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    if(object.systemObject){
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }
    if(await db.objects.countDocuments({id: parentId}) == 0){
        return res.status(404).send('Parent object not found.').end();
    }
    await db.objects.updateOne({id: id}, {$set: {parentId: parentId}});
    res.status(200).send('Object updated.').end();
});

router.post('/update/:id/children',authGuard, async (req, res) => {
    const id = req.params.id;
    const children = req.query.children as string[];
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    if(children == null || !Array.isArray(children)){
        return res.status(400).send('The children must be an array.').end();
    }
    let object = await db.objects.findOne({ id: id });
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    if(object.systemObject){
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }
    for(let i = 0; i < children.length; i++){
        if(typeof children[i] !== 'string'){
            return res.status(400).send('The children must be an array of strings.').end();
        }
        if(await db.objects.countDocuments({id: children[i]}) == 0){
            return res.status(404).send('Child object not found.').end();
        }
    }
    await db.objects.updateOne({id: id}, {$set: {children: children}});
    res.status(200).send('Object updated.').end();
});

router.get('/get/:id', async (req, res) => {
    const id = req.params.id;
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    const object = await db.objects.findOne({id: id});
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    if(!object.allowAnonymous && !isAuthorized(req)){
        return res.status(401).send('You are not authorized to view this object.').end();
    }
    res.status(200).send(object.object).end();
});

router.get('/get/:id/children', async (req, res) => {
    const id = req.params.id;
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    const object = await db.objects.findOne({id: id});
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    if(!object.allowAnonymous && !isAuthorized(req)){
        return res.status(401).send('You are not authorized to view this object.').end();
    }
    res.status(200).send(object.children).end();
});

router.get('/get/root', authGuard, async (req, res) => {
    const object = await db.objects.findOne({parentId: null});
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    res.status(200).send(object.children).end();
});

router.get('/set/:id', async (req, res) => {
    const id = req.params.id;
    const value = req.query.value;
    const key = req.query.key;
    if(id == null || typeof id !== 'string'){
        return res.status(400).send('The id must be a string.').end();
    }
    if(!key || typeof key !== 'string'){
        return res.status(400).send('The key must be a string.').end();
    }
    if(!value){
        return res.status(400).send('The value must not be NULL.').end();
    }
    const object = await db.objects.findOne({id: id});
    if(object == null){
        return res.status(404).send('Object not found.').end();
    }
    if(!object.allowAnonymous && !isAuthorized(req)){
        return res.status(401).send('You are not authorized to modify this object.').end();
    }
    if(object.systemObject){
        return res.status(403).send('This object is a system object and cannot be modified.').end();
    }
    if(!object.object.hasOwnProperty(key)){
        return res.status(404).send('Property not found.').end();
    }
    let val = object.object[key];
    object.object[key] = req.query.value;
    res.status(200).send(JSON.stringify(object.object)).end();
});

module.exports = router;