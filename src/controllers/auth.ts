import express from 'express';
import { authGuard, refresh, signin, signout } from '../guards/AuthGuard';
const router = express.Router();

router.post('/signin', signin);
router.get('/signout', signout);
router.post('/refresh', refresh);

router.get('/', authGuard, (req, res) => {
    res.send('auth');
});

module.exports = router;
module.exports.ROUTER = 'auth';