import express from 'express';
import WebLogger from '..';
import { authGuard, isAuthorized } from '../../../guards/AuthGuard';

const router = express.Router();

router.ws('/stream', async (ws, req) => {
    if (!await isAuthorized(req)) {
        ws.send(JSON.stringify({ error: "Not authorized" }));
        ws.close();
        WebLogger.instance.logger.debug('Websocket closed');
        return;
    }
    WebLogger.instance.logger.on('all', send);
    ws.on('close', () => {
        WebLogger.instance.logger.off('all', send);
    });

    function send(...data: any) {
        if (ws.readyState >= ws.CLOSING) {
            WebLogger.instance.logger.off('all', send);
        }
        ws.send(JSON.stringify(data[0]));
    }
});

router.get('/list', authGuard, (req, res) => {
    res.json(WebLogger.instance.logger.getLogRecords());
});


module.exports = router;