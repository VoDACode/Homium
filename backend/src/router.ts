import express from 'express';
import { serviceManager, IExtensionsService, ILogger } from 'homium-lib/services';

const router = express.Router();

// API routes
router.use('/api', (req, res, next) => {   
    const logger = serviceManager.get(ILogger, 'Router');
    if(req.originalUrl.startsWith('/extensions') || req.originalUrl.startsWith('/api/controllers')){
        return next();
    }
    let extensions = serviceManager.get(IExtensionsService);
    logger.debug('API request: ', req.originalUrl);
    let url = req.headers.referer;
    url = url?.replace(req.hostname, '').replace('http://', '').replace('https://', '');
    let urlParts = url?.split('/');
    if(urlParts?.[1] == 'extensions'){
        let extensionName = urlParts?.[2];
        let extension = extensions.get(extensionName, 'id');
        if(extension){
            logger.debug('Redirecting to /extensions/', extension.id + req.originalUrl);
            res.redirect(308, '/extensions/' + extension.id + req.originalUrl);
        }else{
            logger.debug('Extension not found');
            res.status(404).send('Extension not found');
        }
    }else{
        logger.debug('Redirecting to api/controllers/', req.originalUrl.replace('/api', ''));
        res.redirect(308, '/api/controllers' + req.originalUrl.replace('/api', ''));
    }
});

// Static files
router.use('/static', (req, res, next) => {
    const logger = serviceManager.get(ILogger, 'Router');
    if(req.originalUrl.startsWith('/static') && req.originalUrl != '/static'){
        return next();
    }
    let extensions = serviceManager.get(IExtensionsService);
    logger.debug('Static request: ', req.originalUrl);
    let url = req.headers.referer;
    url = url?.replace(req.hostname, '').replace('http://', '').replace('https://', '');
    let urlParts = url?.split('/');
    if(urlParts?.[1] == 'extensions'){
        let extensionName = urlParts?.[2];
        let extension = extensions.get(extensionName, 'id');
        if(extension){
            logger.debug('Redirecting to extensions/', extension.id + req.originalUrl);
            res.redirect(308, '/extensions/' + extension.id + req.originalUrl);
        }else{
            logger.debug('Extension not found');
            res.send('Extension not found');
        }
    }else{
        logger.debug('Redirecting to app/static/', req.originalUrl.replace('/static', ''));
        res.redirect(308, '/app/static' + req.originalUrl.replace('/static', ''));
    }
});

router.use('/extension-info', (req, res, next) => {
    const logger = serviceManager.get(ILogger, 'Router');
    if(req.originalUrl.startsWith('/extension-info') && req.originalUrl != '/extension-info'){
        return next();
    }
    let extensions = serviceManager.get(IExtensionsService);
    logger.debug('Extension info request: ', req.originalUrl);
    let url = req.headers.referer;
    url = url?.replace(req.hostname, '').replace('http://', '').replace('https://', '');
    let urlParts = url?.split('/');
    if(urlParts?.[1] == 'extensions'){
        let extensionName = urlParts?.[2];
        let extension = extensions.get(extensionName, 'id');
        if(extension){
            res.send({
                id: extension.id,
                api: `/extensions/${extension.id}/api`,
                static: `/extensions/${extension.id}/static`
            }).end();
        }else{
            logger.debug('Extension not found');
            res.send({ error: 'Extension not found' });
        }
    }else{
        logger.debug('Extension not found');
        res.send({ error: 'Extension not found' });
    }
});
    


module.exports = router;