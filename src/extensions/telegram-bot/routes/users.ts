import express from 'express';
import TelegramBotApp from '../index';
import { authGuard } from '../../../guards/AuthGuard';

const router = express.Router();

router.get('/list', authGuard, async (req, res) => {
    const users = await TelegramBotApp.instance.userService.getAll();
    res.json(users);
});

router.post('/success', authGuard, async (req, res) => {
    const id = req.body.id;
    if(!id)
        return res.status(400).json({ error: "id is required" });
    await TelegramBotApp.instance.userService.update(id, { isAuthorized: true });
    res.json({ success: true });
});

router.delete('/remove', authGuard, async (req, res) => {
    const id = req.body.id;
    if(!id)
        return res.status(400).json({ error: "id is required" });
    await TelegramBotApp.instance.userService.remove(id);
    res.json({ success: true });
});

module.exports = router;