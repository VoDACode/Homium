import express from 'express';
import TelegramBotApp from '../index';
import { authGuard } from '../../../guards/AuthGuard';

const router = express.Router();

router.post('/restart', authGuard, (req, res) => {
    try{
        TelegramBotApp.instance.stop();
        TelegramBotApp.instance.start();
        res.send("Bot restarted");
    } catch (e) {
        res.send(e);
    }
});


module.exports = router;