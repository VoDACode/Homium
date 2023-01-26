import express from 'express';
import { authGuard } from '../guards/AuthGuard';
import extensions from '../services/extensions';

const router = express.Router();

router.get('/extensions', authGuard, async (req, res) => {
    res.status(200).send(extensions.allInfo);
});

// TO DO: Add devices support
router.get('/devices', authGuard, async (req, res) => {
    res.status(200).send([]);
});

module.exports = router;