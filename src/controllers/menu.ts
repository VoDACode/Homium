import express from 'express';
import { authGuard } from '../guards/AuthGuard';
import db from '../db';
import { MenuItem } from '../models/MenuItem';

const router = express.Router();

router.get('/list', authGuard, async (req, res) => {
    let data = await db.menu.find({}).toArray();
    if(!data) {
        res.status(404).send('No menu items found');
        return;
    }
    res.status(200).send(data.map(item => new MenuItem(item.name, item.description, item.image, item.url, item.items, item.type)));
});

module.exports = router;