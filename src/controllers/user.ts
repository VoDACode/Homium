import express from 'express';
import { authGuard, getUser } from '../guards/AuthGuard';
import { UserView } from '../models/UserModel';
const router = express.Router();

router.get('/my', authGuard, async (req, res) => {
    const user = await getUser(req);
    if(!user) {
        res.status(401).end();
        return;
    }
    res.json(new UserView(user));
});

module.exports = router;
module.exports.ROUTER = 'users';