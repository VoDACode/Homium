import express from 'express';
import TelegramBotApp from '../index';
import { authGuard } from '../../../guards/AuthGuard';
import { TelegramBotConfig } from '../models/TelegramBotConfig';

const router = express.Router();

router.get('/', authGuard, async (req, res) => {
    let config: TelegramBotConfig = {
        token: await TelegramBotApp.instance.storage.get('token'),
        webhook: await TelegramBotApp.instance.storage.get('webhook')
    };
    res.json(config);
});

router.post('/', authGuard, async (req, res) => {
    const data: TelegramBotConfig = req.body as TelegramBotConfig;
    if (data == null) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    if (data.token == null || data.token == '') {
        res.status(400).json({ error: 'Token is required' });
        return;
    }
    if (data.webhook == null) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    if (data.webhook.enabled == true) {
        if (/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?$/.test(data.webhook.host) == false &&
            /^([\da-z\.-]+)\.([a-z\.]{2,6})(?::\d+)?$/.test(data.webhook.host) == false) {
            res.status(400).json({ error: 'Invalid host' });
            return;
        }
    }else{
        data.webhook.host = '';
    }
    TelegramBotApp.instance.storage.set('token', data.token);
    TelegramBotApp.instance.storage.set('webhook', data.webhook);
    TelegramBotApp.instance.restart();
    res.json({
        token: data.token,
        webhook: data.webhook
    });
});

router.get('/webhook', authGuard, async (req, res) => {
    res.json(TelegramBotApp.instance.storage.get('webhook'));
});


router.get('/token', authGuard, async (req, res) => {
    res.json(TelegramBotApp.instance.storage.get('token'));
});

module.exports = router;