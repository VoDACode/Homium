import express from 'express';
import { authGuard, refresh, signin, signout } from '../guards/AuthGuard';
const router = express.Router();

router.post('/signin', signin);
router.post('/signout', signout);
router.post('/refresh', refresh);
router.get('/status', authGuard, (req, res) => {
    res.status(200).end();
});

router.get('/', authGuard, (req, res) => {
    res.send('auth');
});

module.exports = router;
module.exports.ROUTER = 'auth';