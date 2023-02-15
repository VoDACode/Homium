import express from 'express';
import WebLogger from '..';
import { authGuard, getUser } from '../../../guards/AuthGuard';

const router = express.Router();

router.ws('/stream', async (ws, req) => {
    let user = await getUser(req);
    if (user == null) {
        ws.send(JSON.stringify({ error: "Not authorized" }));
        ws.close();
        WebLogger.instance.logger.debug('Websocket closed');
        return;
    }
    WebLogger.instance.logger.on(send);
    ws.on('close', () => {
        WebLogger.instance.logger.off(send);
    });

    function send(...data: any) {
        if (ws.readyState >= ws.CLOSING) {
            WebLogger.instance.logger.off(send);
        }
        ws.send(JSON.stringify(data[0]));
    }
});

router.get('/list', authGuard, (req, res) => {
    res.json(WebLogger.instance.logger.getLogRecords());
});


module.exports = router;