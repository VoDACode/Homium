import express from 'express';
import { authGuard } from 'homium-lib/utils/auth-guard';
import { serviceManager, IExtensionsService } from 'homium-lib/services';

const router = express.Router();

router.get('/extensions', authGuard, async (req, res) => {
    const extensions = serviceManager.get(IExtensionsService);
    res.status(200).send(extensions.allInfo);
});

// TO DO: Add devices support
router.get('/devices', authGuard, async (req, res) => {
    res.status(200).send([]);
});

module.exports = router;