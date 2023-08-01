import express from 'express';
import { authGuard, hasPermission } from '../guards/AuthGuard';
import { checkForUpdates } from '../boot';
const router = express.Router();

router.post('/update', authGuard, async (req, res) => {
    if(!hasPermission(req, p => p.isAdministrator)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    let result = await checkForUpdates();
    if(result != null) {
        return res.status(200).json({ message: `Update found [${result}], installing...` });
    }else{
        return res.status(200).json({ message: 'No update found.' });
    }
});

module.exports = router;